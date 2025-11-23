import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../slices/productApiSlice";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FaEye } from "react-icons/fa";

const ProductCategoryScreen = () => {
  const { category } = useParams();

  const { data: products, isLoading, error } = useGetProductsByCategoryQuery(category);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">
          {error?.data?.message || "No products found for this category."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="1200px" mx="auto">
      <Typography
        variant="h4"
        color="primary"
        mb={3}
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        Products in "{category}" Category
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl || "/placeholder.png"}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" color="secondary" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cost: ${product.unitCost.toFixed(2)}
                </Typography>

                <Box mt={1} mb={1}>
                  {product.sizeRange?.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      size="small"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        backgroundColor: "#FFD54F",
                        color: "#6D4C41",
                        fontWeight: "bold",
                      }}
                    />
                  ))}
                </Box>

                <Box>
                  {product.colorOptions?.map((color) => (
                    <Chip
                      key={color}
                      label={color}
                      size="small"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        backgroundColor: "#81C784",
                        color: "#1B5E20",
                        fontWeight: "bold",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={`/product/${product._id}`}
                  size="small"
                  color="primary"
                  startIcon={<FaEye />}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductCategoryScreen;
