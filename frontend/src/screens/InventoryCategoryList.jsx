import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetInventoryCategoriesQuery } from "../slices/inventoryApiSlice";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icons for categories
import { GiRolledCloth } from "react-icons/gi";
import { GiSewingString } from "react-icons/gi";
import { MdOutlineCategory } from "react-icons/md";
import { GiClothespin } from "react-icons/gi";

const InventoryCategoryList = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: categories, isLoading, isError } = useGetInventoryCategoriesQuery();

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={5}>
        Failed to load categories.
      </Typography>
    );
  }

  // Assign icons to categories
  const iconMap = {
    fabric: <GiRolledCloth size={40} />,
    trim: <GiSewingString size={40} />,
    accessory: <GiClothespin size={40} />,
    other: <MdOutlineCategory size={40} />,
  };

  // Assign beautiful colors for Textile feel 🎨
  const colorMap = {
    fabric: "#7cb1e6",
    trim: "#f8c471",
    accessory: "#82e0aa",
    other: "#d7bde2",
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ mb: 3, fontWeight: "bold", color: theme.palette.primary.main }}
      >
        Inventory Categories
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: colorMap[category] || "#f0f0f0",
                boxShadow: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 8,
                },
              }}
            >
              <CardActionArea onClick={() => navigate(`/inventoryCategory/${category}`)}>
                <CardContent
                  sx={{
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  <Box sx={{ mb: 1 }}>{iconMap[category] || <MdOutlineCategory size={40} />}</Box>

                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    View all {category} items
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InventoryCategoryList;
