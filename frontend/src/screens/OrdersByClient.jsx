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
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FilterAlt as FilterIcon,
  Inventory as OrderIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetOrdersByClientQuery,
  useDeleteOrderMutation,
} from "../slices/orderApiSlice";
import { toast } from "react-toastify";

const OrdersByClient = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // -----------------------------
  // FILTER STATES (DUE DATE FILTERS)
  // -----------------------------
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  // Query with mapped filters (no clientId needed)
  const { data, isLoading, refetch } = useGetOrdersByClientQuery({
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: filters.page,
    limit: filters.limit,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  // -----------------------------
  // DELETE ORDER
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error deleting order");
    }
  };

  // -----------------------------
  // FILTER CHANGE
  // -----------------------------
  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1, // reset page when filtering
    }));
  };

  // -----------------------------
  // SEARCH BUTTON
  // -----------------------------
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    refetch();
  };

  // -----------------------------
  // RESET BUTTON
  // -----------------------------
  const handleReset = () => {
    const resetFilters = {
      status: "",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 10,
    };
    setFilters(resetFilters);
    refetch();
  };

  // -----------------------------
  // PAGINATION
  // -----------------------------
  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + direction,
    }));
  };

  return (
    <Box p={2}>
      {/* FILTER BAR */}
      <Card
        sx={{
          mb: 3,
          p: 2,
          background: "linear-gradient(135deg, #e3f2fd, #fff9c4)",
          borderLeft: "5px solid #42a5f5",
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
        >
          <FilterIcon color="primary" sx={{ mr: 1 }} /> Filter Orders
        </Typography>

        <Grid container spacing={2}>
          {/* STATUS */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
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

          {/* START DUE DATE */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Start Due Date"
              InputLabelProps={{ shrink: true }}
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Grid>

          {/* END DUE DATE */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="End Due Date"
              InputLabelProps={{ shrink: true }}
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>

        {/* SEARCH + RESET BUTTONS */}
        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Card>

      {/* LOADING */}
      {isLoading && <Typography>Loading orders...</Typography>}

      {/* ORDER LIST */}
      <Grid container spacing={2}>
        {data?.orders?.map((order) =>
          isMobile ? (
            <Grid item xs={12} key={order._id}>
              <Card
                sx={{
                  background: "#fff3e0",
                  borderLeft: "5px solid #fb8c00",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <OrderIcon sx={{ mr: 1 }} />
                    {order.orderNumber}
                  </Typography>

                  <Typography>Status: <b>{order.status}</b></Typography>
                  <Typography>Total Qty: {order.totalQuantity}</Typography>
                  <Typography>
                    Due Date:{" "}
                    {order.dueDate
                      ? new Date(order.dueDate).toLocaleDateString()
                      : "N/A"}
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
            <Grid item xs={12} key={order._id}>
              <Card sx={{ background: "#e8f5e9", borderLeft: "6px solid #4caf50" }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{order.orderNumber}</Typography>
                      <Typography>Status: <b>{order.status}</b></Typography>
                      <Typography>Total Qty: {order.totalQuantity}</Typography>
                      <Typography>
                        Due Date:{" "}
                        {order.dueDate
                          ? new Date(order.dueDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1} alignItems="center">
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
      <Box mt={3} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="secondary"
          disabled={filters.page === 1}
          onClick={() => handlePageChange(-1)}
        >
          Previous
        </Button>

        <Typography mt={1}>
          Page {data?.page} of {data?.totalPages}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          disabled={filters.page >= data?.totalPages}
          onClick={() => handlePageChange(1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default OrdersByClient;
