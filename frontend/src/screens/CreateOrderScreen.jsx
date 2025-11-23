import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  AddCircle,
  Delete,
  Inventory2,
  Assignment,
  Factory,
} from "@mui/icons-material";

import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { useGetUnitsQuery } from "../slices/unitApiSlice";
import { useGetProductsQuery } from "../slices/productApiSlice";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CreateOrderScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [orderNumber, setOrderNumber] = useState("");
  const [client, setClient] = useState(userInfo?._id || "");

  // ⭐ assignedUnits must be an array
  const [assignedUnits, setAssignedUnits] = useState([]);

  const [items, setItems] = useState([
    { product: "", quantity: 1, size: "", color: "" },
  ]);

  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  // ⭐ Fetch units based on logged-in user role
  const {
    data: units = [],
    isLoading: unitsLoading,
    isError: unitsError,
  } = useGetUnitsQuery();

  // ⭐ Fetch products
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useGetProductsQuery();

  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();

  // Add item row
  const addItem = () => {
    setItems([
      ...items,
      { product: "", quantity: 1, size: "", color: "" },
    ]);
  };

  // Remove item row
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Item change handler
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (assignedUnits.length === 0) {
      toast.error("Please assign at least one production unit.");
      return;
    }

    try {
      const orderData = {
        orderNumber,
        client,
        assignedUnits,
        items,
        dueDate,
        notes,
      };

      const res = await createOrder(orderData).unwrap();
      toast.success(`Order ${res.orderNumber} created successfully!`);

      // Reset form
      setOrderNumber("");
      setAssignedUnits([]);
      setItems([{ product: "", quantity: 1, size: "", color: "" }]);
      setDueDate("");
      setNotes("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create order");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 3,
        p: 3,
        borderRadius: 3,
        bgcolor: "#fefefe",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          color: "#2e7d32",
          fontWeight: "bold",
        }}
      >
        <Assignment sx={{ mr: 1, color: "#43a047" }} /> Create New Order
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          {/* Order Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Order Number (Optional)"
              fullWidth
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              InputProps={{
                startAdornment: <Inventory2 sx={{ color: "#0288d1", mr: 1 }} />,
              }}
            />
          </Grid>

          {/* Assigned Units */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Assigned Units"
              fullWidth
              SelectProps={{
                multiple: true,
                value: assignedUnits,
                onChange: (e) => setAssignedUnits(e.target.value),
              }}
            >
              {unitsLoading ? (
                <MenuItem disabled>Loading units...</MenuItem>
              ) : unitsError ? (
                <MenuItem disabled>Error loading units</MenuItem>
              ) : units.length === 0 ? (
                <MenuItem disabled>No units available</MenuItem>
              ) : (
                units.map((unit) => (
                  <MenuItem key={unit._id} value={unit._id}>
                    {unit.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Order Items Section */}
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#1565c0",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          <Factory sx={{ mr: 1 }} /> Order Items
        </Typography>

        {items.map((item, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "#f1f8e9",
              border: "1px solid #aed581",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">

              {/* Product */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Product"
                  fullWidth
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", e.target.value)
                  }
                >
                  {productsLoading ? (
                    <MenuItem disabled>Loading products...</MenuItem>
                  ) : products.length === 0 ? (
                    <MenuItem disabled>No products available</MenuItem>
                  ) : (
                    products.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Qty"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </Grid>

              {/* Size */}
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Size"
                  fullWidth
                  value={item.size}
                  onChange={(e) =>
                    handleItemChange(index, "size", e.target.value)
                  }
                />
              </Grid>

              {/* Color */}
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Color"
                  fullWidth
                  value={item.color}
                  onChange={(e) =>
                    handleItemChange(index, "color", e.target.value)
                  }
                />
              </Grid>

              {/* Remove button */}
              <Grid item xs={12} sm={2} textAlign="center">
                <IconButton color="error" onClick={() => removeItem(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Add Item */}
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddCircle />}
          onClick={addItem}
          sx={{ mb: 3 }}
        >
          Add Item
        </Button>

        <Divider sx={{ mb: 2 }} />

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={creating}
          sx={{
            bgcolor: "#43a047",
            "&:hover": { bgcolor: "#388e3c" },
            py: 1.3,
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {creating ? "Creating Order..." : "Create Order"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateOrderScreen;
