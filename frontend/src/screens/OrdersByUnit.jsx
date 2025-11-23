import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  Factory as UnitIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as OrderIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import {
  useGetOrdersByUnitQuery,
  useDeleteOrderMutation,
} from "../slices/orderApiSlice";

import { useGetUnitsQuery } from "../slices/unitApiSlice";
import { toast } from "react-toastify";

const OrdersByUnit = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [selectedUnit, setSelectedUnit] = useState("");

  // Load units using the unified controller
  const { data: units = [], isLoading: unitsLoading } = useGetUnitsQuery();

  // Load orders for selected unit (skip if blank)
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetOrdersByUnitQuery(selectedUnit, {
    skip: !selectedUnit,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  // Normalize orders into an array safely
  const orders = Array.isArray(ordersData)
    ? ordersData
    : ordersData?.orders || [];

  // --------------------------
  // Pagination
  // --------------------------
  const [page, setPage] = useState(1);
  const limit = 10;

  const startIndex = (page - 1) * limit;
  const paginatedOrders = orders.slice(startIndex, startIndex + limit);
  const totalPages = Math.max(1, Math.ceil(orders.length / limit));

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(orderId).unwrap();
      toast.success("Order deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting order");
    }
  };

  return (
    <Box p={2}>
      {/* UNIT SELECTION */}
      <Card
        sx={{
          mb: 3,
          p: 3,
          background: "linear-gradient(135deg, #e8f5e9, #fff3e0)",
          borderLeft: "8px solid #66bb6a",
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#2e7d32",
          }}
        >
          <UnitIcon sx={{ mr: 1 }} /> Select Unit
        </Typography>

        <TextField
          select
          fullWidth
          label="Choose Unit"
          value={selectedUnit}
          onChange={(e) => {
            setSelectedUnit(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="">-- Select Unit --</MenuItem>

          {unitsLoading ? (
            <MenuItem disabled>Loading units...</MenuItem>
          ) : units.length === 0 ? (
            <MenuItem disabled>No units available</MenuItem>
          ) : (
            units.map((unit) => (
              <MenuItem key={unit._id} value={unit._id}>
                {unit.name} ({unit.address?.city || "No City"})
              </MenuItem>
            ))
          )}
        </TextField>
      </Card>

      {/* LOADING STATE */}
      {isLoading && selectedUnit && (
        <Typography>Loading orders for this unit...</Typography>
      )}

      {/* ORDERS LIST */}
      <Grid container spacing={2}>
        {paginatedOrders.map((order) =>
          isMobile ? (
            /* MOBILE CARD LAYOUT */
            <Grid item xs={12} key={order._id}>
              <Card
                sx={{
                  background: "#e3f2fd",
                  borderLeft: "6px solid #1e88e5",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "#1565c0",
                    }}
                  >
                    <OrderIcon sx={{ mr: 1 }} />
                    {order.orderNumber}
                  </Typography>

                  <Typography variant="body2">
                    Client: {order.client?.name}
                  </Typography>

                  <Typography variant="body2">
                    Total Quantity: {order.totalQuantity}
                  </Typography>

                  <Typography variant="body2">
                    Status: <b>{order.status}</b>
                  </Typography>

                  <Box mt={2} display="flex" gap={1}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <ViewIcon />
                    </IconButton>

                    <IconButton
                      color="success"
                      onClick={() => navigate(`/orders/${order._id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(order._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            /* DESKTOP ROW LAYOUT */
            <Grid item xs={12} key={order._id}>
              <Card
                sx={{
                  background: "#f1f8e9",
                  borderLeft: "6px solid #8bc34a",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {order.orderNumber}
                      </Typography>

                      <Typography variant="body2">
                        Client: {order.client?.name} | {order.client?.phone}
                      </Typography>

                      <Typography variant="body2">
                        Total Qty: {order.totalQuantity}
                      </Typography>

                      <Typography variant="body2">
                        Status: <b>{order.status}</b>
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        <ViewIcon />
                      </IconButton>

                      <IconButton
                        color="success"
                        onClick={() => navigate(`/orders/${order._id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(order._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {/* PAGINATION */}
      {orders.length > 0 && (
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <Typography mt={1}>
            Page {page} of {totalPages}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default OrdersByUnit;
