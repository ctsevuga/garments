import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productApiSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Paper,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";

const ProductDetailsScreen = ({ userRole }) => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">
          {error?.data?.message || "Failed to fetch product details."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="900px" mx="auto">
      <Button
        component={Link}
        to="/productCategory"
        variant="outlined"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                border: "2px solid #00796B",
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              SKU: <strong>{product.sku}</strong>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Category: <strong>{product.category}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {product.description || "No description available."}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Available Sizes:
              </Typography>
              {product.sizeRange?.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  sx={{ mr: 1, mt: 1, backgroundColor: "#FFCDD2", color: "#B71C1C" }}
                />
              ))}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Available Colors:
              </Typography>
              {product.colorOptions?.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  sx={{
                    mr: 1,
                    mt: 1,
                    backgroundColor: "#C8E6C9",
                    color: "#1B5E20",
                  }}
                />
              ))}
            </Box>

            <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
              Unit Cost: ${product.unitCost.toFixed(2)}
            </Typography>

            {/* Actions */}
            <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Edit Button: Visible only for admin */}
              {userRole === "admin" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  component={Link}
                  to={`/product/${product._id}/edit`}
                >
                  Edit
                </Button>
              )}

              {/* Delete Button: Visible only for admin */}
              {userRole === "admin" && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  // Add onClick handler to delete product here
                >
                  Delete
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductDetailsScreen;
