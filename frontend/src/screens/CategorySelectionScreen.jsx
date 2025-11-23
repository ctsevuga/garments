import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../slices/productApiSlice";

import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StyleIcon from "@mui/icons-material/Style";
import InventoryIcon from "@mui/icons-material/Inventory";

const categoryColors = [
  "#4CAF50", // green
  "#2196F3", // blue
  "#FF9800", // orange
  "#9C27B0", // purple
  "#F44336", // red
  "#009688", // teal
];

const icons = [
  <CheckroomIcon sx={{ fontSize: 50 }} />,
  <LocalMallIcon sx={{ fontSize: 50 }} />,
  <StyleIcon sx={{ fontSize: 50 }} />,
  <InventoryIcon sx={{ fontSize: 50 }} />,
];

const CategorySelectionScreen = () => {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress size={70} sx={{ color: "primary.main" }} />
        <Typography mt={2} fontSize={18}>
          Loading Categories...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 6 }}>
        {error?.data?.message || "Failed to load categories"}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        🧵 Explore Product Categories
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {data?.categories?.map((category, index) => {
          const bg = categoryColors[index % categoryColors.length];
          const Icon = icons[index % icons.length];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/productCategory/${category}`)}
                >
                  <Box
                    sx={{
                      background: bg,
                      py: 4,
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {Icon}
                  </Box>

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        color: "#333",
                      }}
                    >
                      {category}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mt: 1,
                      }}
                    >
                      Tap to view all {category} products
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CategorySelectionScreen;
