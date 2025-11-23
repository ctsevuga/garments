import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../slices/inventoryApiSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import { MdArrowBack, MdCategory, MdInventory, MdFactory, MdOutlineStraighten, MdLocalShipping } from "react-icons/md";

const InventoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, isError } = useGetInventoryByIdQuery(id);
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !item) {
    return (
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          ❌ Unable to load inventory item.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        minHeight: "100vh",
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<MdArrowBack />}
        variant="outlined"
        color="primary"
        sx={{ alignSelf: "flex-start", mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          boxShadow: 5,
          p: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ textAlign: "center", fontWeight: 600 }}>
          <MdInventory style={{ marginRight: 8, verticalAlign: "middle" }} />
          {item.itemName}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Category */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <MdCategory size={24} color={theme.palette.secondary.main} style={{ marginRight: 8 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.category}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <MdOutlineStraighten size={24} color={theme.palette.success.main} style={{ marginRight: 8 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Quantity
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.quantity} {item.unitOfMeasure}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Reorder Level */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <MdFactory size={24} color={theme.palette.warning.main} style={{ marginRight: 8 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Reorder Level
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: item.quantity <= item.reorderLevel ? "error.main" : "text.primary",
                  }}
                >
                  {item.reorderLevel}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Supplier */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <MdLocalShipping size={24} color={theme.palette.info.main} style={{ marginRight: 8 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Supplier
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.supplierName || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Unit */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <MdFactory size={24} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Unit
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.unit?.name || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(`/inventory/edit/${item._id}`)}
          >
            ✏️ Edit Item
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default InventoryDetails;
