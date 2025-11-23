// src/screens/OrderEdit.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  Edit as EditIcon,
  Factory as FactoryIcon,
  Info as InfoIcon,
  Notes as NotesIcon,
  CalendarMonth as CalendarIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../slices/orderApiSlice";

import { useGetUnitsQuery } from "../slices/unitApiSlice";

const statusColors = {
  Created: "info",
  "In Production": "warning",
  "Quality Check": "secondary",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const { data: order, isLoading } = useGetOrderByIdQuery(id);
  const { data: units } = useGetUnitsQuery();

  const [updateOrder] = useUpdateOrderMutation();

  // -----------------------------
  // Local State
  // -----------------------------
  const [formData, setFormData] = useState({
    assignedUnits: [],
    status: "",
    dueDate: "",
    notes: "",
  });

  // fill on load
  useEffect(() => {
    if (order) {
      setFormData({
        assignedUnits: order.assignedUnits?.map((u) => u._id) || [],
        status: order.status,
        dueDate: order.dueDate ? order.dueDate.substring(0, 10) : "",
        notes: order.notes || "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUnitChange = (e) => {
    const {
      target: { value },
    } = e;

    setFormData((prev) => ({
      ...prev,
      assignedUnits: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateOrder({ id, ...formData }).unwrap();
      toast.success("Order updated successfully");
      navigate(`/orders/${id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Typography>Loading order...</Typography>;

  return (
    <Box p={isMobile ? 1 : 3}>
      {/* ============================
          PAGE HEADER
      ============================= */}
      <Box
        mb={3}
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ background: "#e3f2fd", p: 2, borderRadius: 2 }}
      >
        <EditIcon color="primary" />
        <Typography variant="h5" fontWeight="bold">
          Edit Order — {order.orderNumber}
        </Typography>
      </Box>

      {/* ============================
          STATUS CARD
      ============================= */}
      <Card sx={{ mb: 3, background: "#fff8e1" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <InfoIcon color="warning" />
                <Typography variant="h6">Order Status</Typography>
              </Box>

              <TextField
                fullWidth
                select
                label="Select Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.keys(statusColors).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Chip
                      label={status}
                      color={statusColors[status]}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ============================
          ASSIGNED UNITS
      ============================= */}
      <Card sx={{ mb: 3, background: "#e8f5e9" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FactoryIcon color="success" />
            <Typography variant="h6">Assign Production Units</Typography>
          </Box>

          <TextField
            fullWidth
            select
            SelectProps={{ multiple: true }}
            label="Assigned Units"
            value={formData.assignedUnits}
            onChange={handleUnitChange}
          >
            {units?.map((unit) => (
              <MenuItem key={unit._id} value={unit._id}>
                {unit.name} — {unit.city}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* ============================
          DUE DATE
      ============================= */}
      <Card sx={{ mb: 3, background: "#f1f8ff" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CalendarIcon color="primary" />
            <Typography variant="h6">Due Date</Typography>
          </Box>

          <TextField
            fullWidth
            type="date"
            name="dueDate"
            label="Select Due Date"
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* ============================
          NOTES
      ============================= */}
      <Card sx={{ mb: 3, background: "#fff3e0" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <NotesIcon color="warning" />
            <Typography variant="h6">Notes</Typography>
          </Box>

          <TextField
            fullWidth
            name="notes"
            label="Order Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* ============================
          SAVE BUTTON
      ============================= */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default OrderEdit;
