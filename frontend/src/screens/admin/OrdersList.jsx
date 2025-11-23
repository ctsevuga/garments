// src/screens/OrdersList.jsx

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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "../../slices/orderApiSlice";
import { useGetUnitsQuery } from "../../slices/unitApiSlice";
import { toast } from "react-toastify";

const OrdersList = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // -----------------------------
  // FILTER STATE
  // -----------------------------
  const [filters, setFilters] = useState({
    client: "",
    status: "",
    dueStartDate: "",
    dueEndDate: "",
    page: 1,
    limit: 10,
  });

  const { data: units } = useGetUnitsQuery();

  // -----------------------------
  // API QUERY WITH CORRECT KEYS
  // -----------------------------
  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    client: filters.client,
    status: filters.status,
    startDate: filters.dueStartDate,
    endDate: filters.dueEndDate,
    page: filters.page,
    limit: filters.limit,
  });

  const [deleteOrder] = useDeleteOrderMutation();

  // -----------------------------
  // DELETE HANDLER
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
  // FILTER CHANGE HANDLER
  // -----------------------------
  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
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
    const resetValues = {
      client: "",
      status: "",
      dueStartDate: "",
      dueEndDate: "",
      page: 1,
      limit: 10,
    };
    setFilters(resetValues);
    refetch();
  };

  // -----------------------------
  // PAGE CHANGE HANDLER
  // -----------------------------
  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + direction,
    }));
  };

  return (
    <Box p={2}>
      {/* -----------------------------------
          FILTER BAR
      ----------------------------------- */}
      <Card sx={{ mb: 3, p: 2, background: "#f1f7ff" }}>
        <Typography
          variant="h6"
          mb={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FilterIcon color="primary" sx={{ mr: 1 }} /> Filter Orders
        </Typography>

        <Grid container spacing={2}>
          {/* CLIENT FILTER */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Client / Unit"
              name="client"
              value={filters.client}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {units?.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* STATUS FILTER */}
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

          {/* DUE DATE START */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Due Date (Start)"
              InputLabelProps={{ shrink: true }}
              name="dueStartDate"
              value={filters.dueStartDate}
              onChange={handleFilterChange}
            />
          </Grid>

          {/* DUE DATE END */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Due Date (End)"
              InputLabelProps={{ shrink: true }}
              name="dueEndDate"
              value={filters.dueEndDate}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>

        {/* ---------- SEARCH + RESET BUTTONS ---------- */}
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<FilterIcon />}
          >
            Search
          </Button>

          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Card>

      {/* -----------------------------------
          LOADING
      ----------------------------------- */}
      {isLoading && <Typography>Loading orders...</Typography>}

      {/* -----------------------------------
          ORDERS LIST
      ----------------------------------- */}
      <Grid container spacing={2}>
        {data?.orders?.map((order) =>
          isMobile ? (
            // MOBILE VIEW
            <Grid item xs={12} key={order._id}>
              <Card sx={{ background: "#fff7f0" }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {order.orderNumber}
                  </Typography>

                  <Typography variant="body2">
                    Status: <b>{order.status}</b>
                  </Typography>

                  <Typography variant="body2">
                    Client: {order?.client?.name}
                  </Typography>

                  <Typography variant="body2">
                    Total Qty: {order.totalQuantity}
                  </Typography>

                  <Typography variant="body2">
                    Due Date: <b>{order?.dueDate?.split("T")[0]}</b>
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
            // DESKTOP VIEW
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">
                        {order.orderNumber}
                      </Typography>
                      <Typography variant="body2">
                        Client: {order?.client?.name}
                      </Typography>
                      <Typography variant="body2">
                        Status: <b>{order.status}</b>
                      </Typography>
                      <Typography variant="body2">
                        Due Date: <b>{order?.dueDate?.split("T")[0]}</b>
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

      {/* -----------------------------------
          PAGINATION
      ----------------------------------- */}
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

export default OrdersList;
