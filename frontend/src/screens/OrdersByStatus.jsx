import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterIcon,
  CheckCircle as StatusIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetOrdersByStatusQuery,
  useDeleteOrderMutation,
} from "../slices/orderApiSlice";

import { useGetUnitsQuery } from "../slices/unitApiSlice";

const OrdersByStatus = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // -----------------------------
  // FILTERS
  // -----------------------------
  const [filters, setFilters] = useState({
    status: "Created",
    unit: "",
  });

  const { data: units } = useGetUnitsQuery();

  const { data: orders, refetch, isLoading } = useGetOrdersByStatusQuery({
    status: filters.status,
    unit: filters.unit,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box p={2}>
      {/* ============================
         FILTER BAR
      ============================= */}
      <Card sx={{ p: 2, mb: 3, background: "#e9f5ff" }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <FilterIcon sx={{ mr: 1 }} color="primary" /> Filter Orders By Status
        </Typography>

        <Grid container spacing={2}>
          {/* STATUS DROPDOWN */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              name="status"
              label="Order Status"
              value={filters.status}
              onChange={handleChange}
            >
              {[
                "Created",
                "In Production",
                "Quality Check",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* UNIT DROPDOWN */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              name="unit"
              label="Filter by Unit (optional)"
              value={filters.unit}
              onChange={handleChange}
            >
              <MenuItem value="">All Units</MenuItem>
              {units?.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* ============================
         LOADING
      ============================= */}
      {isLoading && <Typography>Loading orders...</Typography>}

      {/* ============================
         ORDERS LIST DISPLAY
      ============================= */}
      <Grid container spacing={2}>
        {orders?.map((order) =>
          isMobile ? (
            // ========== MOBILE CARD ==========
            <Grid item xs={12} key={order._id}>
              <Card sx={{ background: "#fff8e6" }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {order.orderNumber}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    <StatusIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <b>{order.status}</b>
                  </Typography>

                  <Typography>Client: {order.client?.name}</Typography>

                  <Typography>
                    Units Assigned:{" "}
                    {order.assignedUnits?.map((u) => u.name).join(", ")}
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
            // ========== DESKTOP CARD ==========
            <Grid item xs={12} md={6} key={order._id}>
              <Card sx={{ background: "#f0fff4", borderLeft: "5px solid #2e7d32" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" color="primary">
                        {order.orderNumber}
                      </Typography>

                      <Typography>
                        Status: <b>{order.status}</b>
                      </Typography>

                      <Typography>Client: {order.client?.name}</Typography>

                      <Typography>
                        Units Assigned:{" "}
                        {order.assignedUnits?.map((u) => u.name).join(", ")}
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
    </Box>
  );
};

export default OrdersByStatus;
