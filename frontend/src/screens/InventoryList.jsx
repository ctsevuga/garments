import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllInventoryQuery, useDeleteInventoryItemMutation } from "../slices/inventoryApiSlice";
import { Grid, Card, CardContent, Typography, IconButton, Box, Divider, Tooltip } from "@mui/material";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { useTheme } from "@mui/material/styles";

const InventoryList = () => {
  const navigate = useNavigate();
  const { data: inventory, isLoading, isError } = useGetAllInventoryQuery();
  const [deleteInventoryItem] = useDeleteInventoryItemMutation();
  const theme = useTheme();

  // Handler for delete action
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      deleteInventoryItem(id);
    }
  };

  // Conditional Rendering of loading/error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching inventory data.</div>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Inventory List
      </Typography>

      <Grid container spacing={3}>
        {inventory.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ borderRadius: "8px", overflow: "hidden", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" component="div" color={theme.palette.primary.main}>
                  {item.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity} {item.unitOfMeasure}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supplier: {item.supplierName || "Not provided"}
                </Typography>

                <Divider sx={{ marginY: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* View Button */}
                  <Tooltip title="View Inventory" arrow>
                    <IconButton color="primary" onClick={() => navigate(`/inventory/view/${item._id}`)}>
                      <MdVisibility />
                    </IconButton>
                  </Tooltip>

                  {/* Edit Button */}
                  <Tooltip title="Edit Inventory" arrow>
                    <IconButton color="warning" onClick={() => navigate(`/inventory/edit/${item._id}`)}>
                      <MdEdit />
                    </IconButton>
                  </Tooltip>

                  {/* Delete Button */}
                  <Tooltip title="Delete Inventory" arrow>
                    <IconButton color="error" onClick={() => deleteHandler(item._id)}>
                      <MdDelete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InventoryList;
