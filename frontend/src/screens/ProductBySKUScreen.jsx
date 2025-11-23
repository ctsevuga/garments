import React, { useState, useEffect } from "react";
import { useGetProductBySKUQuery } from "../slices/productApiSlice";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  CircularProgress,
  Fade,
} from "@mui/material";
import { toast } from "react-toastify";
import { FaSearch, FaDollarSign, FaBoxOpen } from "react-icons/fa";

// Debounce delay
const DEBOUNCE_DELAY = 600;

const ProductBySKUScreen = () => {
  const [skuInput, setSkuInput] = useState("");
  const [debouncedSKU, setDebouncedSKU] = useState("");

  // Debounce: update debouncedSKU after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSKU(skuInput.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [skuInput]);

  const {
    data: product,
    isLoading,
    error,
    isFetching,
  } = useGetProductBySKUQuery(debouncedSKU, {
    skip: !debouncedSKU,
  });

  // Toast Messages
  useEffect(() => {
    if (debouncedSKU && product) {
      toast.success("🎉 Product found!");
    }
    if (debouncedSKU && error) {
      toast.error(error?.data?.message || "❌ Product not found");
    }
  }, [product, error, debouncedSKU]);

  return (
    <Box p={2} maxWidth="700px" mx="auto">
      <Typography
        variant="h4"
        color="primary"
        textAlign="center"
        mb={3}
        sx={{
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        🔍 Search Product by SKU
      </Typography>

      {/* Search Bar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="center"
        alignItems="center"
        mb={3}
      >
        <TextField
          label="Type SKU to Search..."
          variant="outlined"
          value={skuInput}
          onChange={(e) => setSkuInput(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: <FaSearch style={{ opacity: 0.6 }} />,
          }}
        />
      </Box>

      {/* Animated Loading Spinner */}
      {(isLoading || isFetching) && debouncedSKU && (
        <Fade in={true}>
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress size={48} color="secondary" />
          </Box>
        </Fade>
      )}

      {/* No product found */}
      {error && debouncedSKU && (
        <Fade in={true}>
          <Box
            mt={4}
            textAlign="center"
            sx={{ color: "#d32f2f", fontWeight: "bold" }}
          >
            <FaBoxOpen size={36} />
            <Typography mt={1} variant="h6">
              Product Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different SKU
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Product Display Card */}
      {product && (
        <Fade in={true}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
              maxWidth: 600,
              mx: "auto",
              mt: 4,
              overflow: "hidden",
              animation: "fadeSlideIn 0.6s ease",
              "@keyframes fadeSlideIn": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <CardMedia
              component="img"
              height="260"
              image={
                product.imageUrl ||
                "https://via.placeholder.com/350x260.png?text=No+Image"
              }
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />

            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {product.name}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                <strong>SKU:</strong> {product.sku}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                <strong>Category:</strong> {product.category}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {product.description}
              </Typography>

              <Typography
                variant="h6"
                color="secondary"
                mt={2}
                display="flex"
                alignItems="center"
              >
                <FaDollarSign style={{ marginRight: 5 }} />{" "}
                {product.unitCost.toFixed(2)}
              </Typography>

              {/* Sizes */}
              <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                {product.sizeRange?.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    size="small"
                    sx={{
                      backgroundColor: "#FFE082",
                      color: "#6D4C41",
                      fontWeight: "bold",
                    }}
                  />
                ))}
              </Box>

              {/* Colors */}
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {product.colorOptions?.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    size="small"
                    sx={{
                      backgroundColor: "#A5D6A7",
                      color: "#1B5E20",
                      fontWeight: "bold",
                    }}
                  />
                ))}
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end", pr: 3, pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                href={`/product/${product._id}`}
                sx={{ borderRadius: 2 }}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Fade>
      )}
    </Box>
  );
};

export default ProductBySKUScreen;
