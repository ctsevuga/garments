// src/screens/OrderDetails.jsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Factory as FactoryIcon,
  Person as PersonIcon,
  LocalShipping as ShippingIcon,
  Inventory2 as ProductIcon,
  ConfirmationNumber as OrderIcon,
  Info as InfoIcon,
  ColorLens as ColorIcon,
  Straighten as SizeIcon,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../slices/orderApiSlice";

const statusColors = {
  Created: "info",
  "In Production": "warning",
  "Quality Check": "secondary",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};

const OrderDetails = () => {
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width:768px)");

  const { data: order, isLoading, error } = useGetOrderByIdQuery(id);

  if (isLoading) return <Typography>Loading Order...</Typography>;
  if (error) return <Typography color="error">Error loading order</Typography>;

  return (
    <Box p={isMobile ? 1 : 3}>
      {/* =========================
         TITLE 
      ========================== */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={3}
        sx={{ background: "#f3f8ff", p: 2, borderRadius: 2 }}
      >
        <OrderIcon color="primary" />
        <Typography variant="h5" fontWeight="bold">
          Order Details — {order.orderNumber}
        </Typography>
      </Box>

      {/* =========================
        ORDER SUMMARY CARD
      ========================== */}
      <Card sx={{ mb: 3, background: "#fff7f0" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">
                Status:
              </Typography>
              <Chip
                label={order.status}
                color={statusColors[order.status]}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Total Quantity:</Typography>
              <Typography fontWeight="bold">{order.totalQuantity}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Due Date:</Typography>
              <Typography>{order.dueDate ? order.dueDate.substring(0, 10) : "N/A"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =========================
        CLIENT INFO
      ========================== */}
      <Card sx={{ mb: 3, background: "#eafbf0" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PersonIcon color="success" />
            <Typography variant="h6" fontWeight="bold">
              Client Info
            </Typography>
          </Box>

          <Typography><b>Name:</b> {order.client?.name}</Typography>
          <Typography><b>Email:</b> {order.client?.email}</Typography>
          <Typography><b>Phone:</b> {order.client?.phone}</Typography>
        </CardContent>
      </Card>

      {/* =========================
        ASSIGNED UNITS
      ========================== */}
      <Card sx={{ mb: 3, background: "#f1f7ff" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FactoryIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Assigned Production Units
            </Typography>
          </Box>

          {order.assignedUnits?.length === 0 ? (
            <Typography>No units assigned.</Typography>
          ) : (
            order.assignedUnits.map((u) => (
              <Box key={u._id} sx={{ mb: 2 }}>
                <Typography><b>{u.name}</b></Typography>
                <Typography>City: {u.city}</Typography>
                <Typography>Capacity: {u.capacity}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* =========================
        ORDER ITEMS
      ========================== */}
      <Card sx={{ mb: 3, background: "#fff0f3" }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ProductIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Ordered Garments / Products
            </Typography>
          </Box>

          {order.items.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "white",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {item.product?.name}
              </Typography>
              <Typography>SKU: {item.product?.sku}</Typography>
              <Typography>Category: {item.product?.category}</Typography>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={4}>
                  <Chip
                    icon={<InfoIcon />}
                    label={`Qty: ${item.quantity}`}
                    color="info"
                  />
                </Grid>

                <Grid item xs={4}>
                  <Chip
                    icon={<SizeIcon />}
                    label={item.size || "No Size"}
                    color="secondary"
                  />
                </Grid>

                <Grid item xs={4}>
                  <Chip
                    icon={<ColorIcon />}
                    label={item.color || "No Color"}
                    color="warning"
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* =========================
        NOTES
      ========================== */}
      {order.notes && (
        <Card sx={{ mb: 3, background: "#fefae0" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Notes
            </Typography>
            <Typography>{order.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OrderDetails;
