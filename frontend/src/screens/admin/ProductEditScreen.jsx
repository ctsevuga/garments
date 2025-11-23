import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../slices/productApiSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sizeRange, setSizeRange] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [unitCost, setUnitCost] = useState(0);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category);
      setDescription(product.description || "");
      setSizeRange(product.sizeRange || []);
      setColorOptions(product.colorOptions || []);
      setImageUrl(product.imageUrl || "");
      setUnitCost(product.unitCost || 0);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        id: product._id,
        name,
        sku,
        category,
        description,
        sizeRange,
        colorOptions,
        imageUrl,
        unitCost: parseFloat(unitCost),
      }).unwrap();
      navigate("/products");
    } catch (err) {
      setFormError(err?.data?.message || "Update failed");
    }
  };

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
        <Alert severity="error">{error?.data?.message || "Failed to fetch product."}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="900px" mx="auto">
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" mb={3}>
          Edit Product
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={submitHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit Cost"
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sizes (comma separated)"
                value={sizeRange.join(",")}
                onChange={(e) =>
                  setSizeRange(e.target.value.split(",").map((s) => s.trim()))
                }
                fullWidth
              />
              <Box mt={1}>
                {sizeRange.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    sx={{ mr: 1, mt: 1, backgroundColor: "#FFCDD2", color: "#B71C1C" }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Colors (comma separated)"
                value={colorOptions.join(",")}
                onChange={(e) =>
                  setColorOptions(e.target.value.split(",").map((c) => c.trim()))
                }
                fullWidth
              />
              <Box mt={1}>
                {colorOptions.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    sx={{ mr: 1, mt: 1, backgroundColor: "#C8E6C9", color: "#1B5E20" }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Save />}
            sx={{ mt: 3 }}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ProductEditScreen;
