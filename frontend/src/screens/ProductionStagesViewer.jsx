import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import {
  GiCutDiamond,
  GiSewingMachine,
  GiClothes,
  GiCardboardBox,
  GiCheckMark,
} from "react-icons/gi";

import { useGetUnitsQuery } from "../slices/unitApiSlice";
import { useGetOrdersByUnitQuery } from "../slices/orderApiSlice";
import { useGetStagesByOrderQuery } from "../slices/productionStageApiSlice";

const stageIcons = {
  Cutting: <GiCutDiamond size={28} color="#d9534f" />,
  Stitching: <GiSewingMachine size={28} color="#0275d8" />,
  Finishing: <GiClothes size={28} color="#5cb85c" />,
  Packaging: <GiCardboardBox size={28} color="#f0ad4e" />,
  Completed: <GiCheckMark size={28} color="#292b2c" />,
};

const stageColors = {
  Cutting: "error",
  Stitching: "primary",
  Finishing: "success",
  Packaging: "warning",
  Completed: "secondary",
};

const ProductionStagesViewer = () => {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  // Fetch Units
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  // Fetch Orders based on Unit
  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetOrdersByUnitQuery(selectedUnit, { skip: !selectedUnit });

  // Normalize orders data safely
  const orders =
    Array.isArray(ordersResponse)
      ? ordersResponse
      : Array.isArray(ordersResponse?.orders)
      ? ordersResponse.orders
      : Array.isArray(ordersResponse?.data)
      ? ordersResponse.data
      : [];

  // Fetch Stages based on Order
  const {
    data: stagesResponse,
    isLoading: stagesLoading,
    refetch: refetchStages,
  } = useGetStagesByOrderQuery(selectedOrder, { skip: !selectedOrder });

  // Normalize stages safely
  const stages =
    Array.isArray(stagesResponse)
      ? stagesResponse
      : Array.isArray(stagesResponse?.stages)
      ? stagesResponse.stages
      : [];

  useEffect(() => {
    if (selectedUnit) refetchOrders();
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedOrder) refetchStages();
  }, [selectedOrder]);

  return (
    <Box sx={{ padding: "1rem", maxWidth: 900, margin: "auto" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        🧵 Production Stage Tracker
      </Typography>

      {/* UNIT DROPDOWN */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Unit</InputLabel>
        <Select
          value={selectedUnit}
          label="Select Unit"
          onChange={(e) => {
            setSelectedUnit(e.target.value);
            setSelectedOrder("");
          }}
        >
          {unitsLoading && <MenuItem>Loading units...</MenuItem>}
          {Array.isArray(units) &&
            units.map((unit) => (
              <MenuItem value={unit._id} key={unit._id}>
                🏭 {unit.name} — {unit.city}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* ORDER DROPDOWN */}
      {selectedUnit && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Order</InputLabel>

          <Select
            value={selectedOrder}
            label="Select Order"
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            {ordersLoading && <MenuItem>Loading Orders...</MenuItem>}

            {orders.length > 0 ? (
              orders.map((order) => (
                <MenuItem value={order._id} key={order._id}>
                  📦 Order #{order.orderNumber || order._id.slice(-6)}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Orders Available</MenuItem>
            )}
          </Select>
        </FormControl>
      )}

      {/* STAGES LOADING */}
      {stagesLoading && selectedOrder && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
          <Typography>Loading Stages...</Typography>
        </Box>
      )}

      {/* STAGES LIST */}
      {stages.length > 0 && (
        <Grid container spacing={2}>
          {stages.map((stage) => (
            <Grid item xs={12} sm={6} key={stage._id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 3,
                  background: "linear-gradient(to right, #ffffff, #f7f7f7)",
                  boxShadow: 3,
                }}
              >
                <Box sx={{ mr: 2 }}>{stageIcons[stage.stage]}</Box>

                <CardContent sx={{ padding: 0 }}>
                  <Typography variant="h6">{stage.stage}</Typography>

                  <Chip
                    label={`${stage.progress}% Complete`}
                    color={stageColors[stage.stage]}
                    sx={{ mt: 1, fontWeight: "bold" }}
                  />

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Started: {new Date(stage.startedAt).toLocaleString()}
                  </Typography>

                  {stage.completedAt && (
                    <Typography variant="body2">
                      Completed: {new Date(stage.completedAt).toLocaleString()}
                    </Typography>
                  )}

                  {stage.remarks && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontStyle: "italic", color: "gray" }}
                    >
                      “{stage.remarks}”
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* NO STAGES */}
      {selectedOrder && !stagesLoading && stages.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "red", mt: 3 }}>
          No production stages found.
        </Typography>
      )}
    </Box>
  );
};

export default ProductionStagesViewer;
