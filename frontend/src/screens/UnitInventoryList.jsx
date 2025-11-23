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
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  MdVisibility,
  MdEdit,
  MdDelete,
  MdWarehouse,
  MdAddCircleOutline,
} from "react-icons/md";
import {
  useGetInventoryByUnitQuery,
  useDeleteInventoryItemMutation,
} from "../slices/inventoryApiSlice";

const UnitInventoryList = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch inventory by unit
  const {
    data: inventory = [],
    isLoading,
    isError,
  } = useGetInventoryByUnitQuery(unitId);

  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  // 🗑️ Delete handler
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 5 }}>
        ⚠️ Failed to load inventory for this unit.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
      }}
    >
      {/* Header Section */}
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
            color: theme.palette.primary.dark,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MdWarehouse /> Unit Inventory
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<MdAddCircleOutline />}
          sx={{ mt: { xs: 2, sm: 0 } }}
          onClick={() => navigate(`/inventory/create/${unitId}`)}
        >
          Add New Item
        </Button>
      </Box>

      {inventory.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No inventory items found for this unit.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {inventory.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 5,
                  overflow: "hidden",
                  backgroundColor: "white",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                  >
                    {item.itemName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Category: {item.category}
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

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip title="View Item">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/inventory/view/${item._id}`)}
                      >
                        <MdVisibility />
                      </IconButton>
                    </Tooltip>

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

export default UnitInventoryList;
