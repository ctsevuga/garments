import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Button,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  MdVisibility,
  MdEdit,
  MdDelete,
  MdCategory,
  MdAddCircleOutline,
} from "react-icons/md";

import {
  useGetInventoryByCategoryQuery,
  useDeleteInventoryItemMutation,
} from "../slices/inventoryApiSlice";

const categoryColors = {
  fabric: "#E0F7FA",
  trim: "#FFF3E0",
  accessory: "#E8F5E9",
  other: "#F3E5F5",
};

const InventoryByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // ⭐ Get logged-in user role
  const { userInfo } = useSelector((state) => state.auth);
  const userRole = userInfo?.role || "guest";

  const {
    data: inventory = [],
    isLoading,
    isError,
    error,
  } = useGetInventoryByCategoryQuery(category);

  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await deleteInventoryItem(id).unwrap();
        toast.success("🧺 Inventory item deleted successfully!");
      } catch (err) {
        toast.error(err?.data?.message || "❌ Error deleting item");
      }
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 5 }}>
        ⚠️ {error?.data?.message || "Failed to load category inventory"}
      </Typography>
    );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.primary.dark,
          }}
        >
          <MdCategory /> Inventory - {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>

        
       
      </Box>

      {inventory.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No items found under "{category}" category.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {inventory.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 6,
                  backgroundColor: categoryColors[item.category] || "white",
                  transition: "transform 0.2s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 10,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                  >
                    {item.itemName}
                  </Typography>

                  <Chip
                    label={item.category.toUpperCase()}
                    sx={{
                      backgroundColor: theme.palette.secondary.light,
                      fontWeight: 600,
                      mt: 1,
                    }}
                  />

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Unit: {item.unit?.name || "N/A"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} {item.unitOfMeasure}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Reorder Level:{" "}
                    <span
                      style={{
                        color:
                          item.quantity <= item.reorderLevel
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    >
                      {item.reorderLevel}
                    </span>
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Supplier: {item.supplierName || "N/A"}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* ⭐ ROLE-BASED ACTION BUTTONS ⭐ */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: userRole === "admin" ? "space-between" : "center",
                    }}
                  >
                    {/* View button: always visible */}
                    <Tooltip title="View Item">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/inventory/view/${item._id}`)}
                      >
                        <MdVisibility />
                      </IconButton>
                    </Tooltip>

                    {/* Admin can edit & delete */}
                    {userRole === "admin" && (
                      <>
                        <Tooltip title="Edit Item">
                          <IconButton
                            color="warning"
                            onClick={() => navigate(`/inventory/edit/${item._id}`)}
                          >
                            <MdEdit />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Item">
                          <IconButton
                            color="error"
                            onClick={() => deleteHandler(item._id)}
                          >
                            <MdDelete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default InventoryByCategory;
