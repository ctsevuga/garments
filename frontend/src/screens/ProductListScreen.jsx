import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "../slices/productApiSlice";
import { toast } from "react-toastify";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const { data: categoryData } = useGetCategoriesQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const userRole = userInfo.role;
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("🧹 Product deleted successfully!");
      setOpenDialog(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  // ⭐ FILTER LOGIC
  const filteredProducts =
    products?.filter((product) => {
      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Filter by sizes
      if (selectedSizes.length > 0) {
        return product.sizeRange?.some((s) => selectedSizes.includes(s));
      }

      return true;
    }) || [];

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
        <Typography mt={2}>Loading products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error?.data?.message || "Failed to load products"}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "primary.main",
          textAlign: "center",
        }}
      >
        🧵 Textile & Garment Products
      </Typography>

      {/* ⭐ Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          justifyContent: "center",
        }}
      >
        {/* Category Filter */}
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categoryData?.categories?.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Size Multi-select */}
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Sizes</InputLabel>
          <Select
            multiple
            value={selectedSizes}
            onChange={(e) => setSelectedSizes(e.target.value)}
            input={<OutlinedInput label="Sizes" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {AVAILABLE_SIZES.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ⭐ PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <Alert severity="info">No products match your filter.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    product.imageUrl ||
                    "https://via.placeholder.com/300x180.png?text=No+Image"
                  }
                  alt={product.name}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#00695C" }}
                    noWrap
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>SKU:</b> {product.sku || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Category:</b> {product.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#00897B" }}>
                    💲 {product.unitCost?.toFixed(2)} / unit
                  </Typography>

                  {product.sizeRange?.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Sizes: {product.sizeRange.join(", ")}
                    </Typography>
                  )}

                  {product.colorOptions?.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Colors: {product.colorOptions.join(", ")}
                    </Typography>
                  )}
                </CardContent>

                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Box>
                    <Tooltip title="View Product">
                      <IconButton
                        component={Link}
                        to={`/product/${product._id}`}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {userRole === "admin" && (
                      <>
                        <Tooltip title="Edit Product">
                          <IconButton
                            component={Link}
                            to={`/product/${product._id}/edit`}
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Product">
                          <IconButton
                            onClick={() => handleDeleteClick(product)}
                            color="error"
                            disabled={isDeleting}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Are you sure you want to delete <b>{selectedProduct?.name}</b>?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductListScreen;
