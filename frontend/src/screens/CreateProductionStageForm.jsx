import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Select,
  CircularProgress,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BuildIcon from "@mui/icons-material/Build";
import FactoryIcon from "@mui/icons-material/Factory";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { useCreateProductionStageMutation } from "../slices/productionStageApiSlice";
import { useGetUnitsQuery } from "../slices/unitApiSlice"; // ✅ updated
import { useGetOrdersByUnitQuery } from "../slices/orderApiSlice";

import { toast } from "react-toastify";

const stageOptions = [
  "Cutting",
  "Stitching",
  "Finishing",
  "Packaging",
  "Completed",
];

const CreateProductionStageForm = () => {
  const [formData, setFormData] = useState({
    order: "",
    unit: "",
    stage: "",
    startedAt: "",
    completedAt: "",
    progress: "",
    remarks: "",
  });

  // ✅ Using unified units controller
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  // Load orders only when unit is selected
  const {
    data: orders,
    isLoading: ordersLoading,
  } = useGetOrdersByUnitQuery(formData.unit, {
    skip: !formData.unit,
  });

  const [createProductionStage, { isLoading }] =
    useCreateProductionStageMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "unit") {
      setFormData((prev) => ({ ...prev, order: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createProductionStage(formData).unwrap();
      toast.success("Production Stage Created Successfully!");

      setFormData({
        order: "",
        unit: "",
        stage: "",
        startedAt: "",
        completedAt: "",
        progress: "",
        remarks: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Error creating production stage");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Card
        sx={{
          background: "linear-gradient(135deg, #e3f2fd, #fff3e0)",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <ChecklistIcon color="primary" />
            Create Production Stage
          </Typography>

          <form onSubmit={submitHandler}>
            <Grid container spacing={2}>

              {/* UNIT DROPDOWN */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    label="Select Unit"
                    onChange={handleChange}
                  >
                    {unitsLoading && (
                      <MenuItem disabled>Loading units...</MenuItem>
                    )}

                    {!unitsLoading &&
                      units?.map((u) => (
                        <MenuItem key={u._id} value={u._id}>
                          <FactoryIcon sx={{ mr: 1 }} />
                          {u.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ORDER DROPDOWN */}
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!formData.unit}>
                  <InputLabel>Select Order</InputLabel>
                  <Select
                    name="order"
                    value={formData.order}
                    label="Select Order"
                    onChange={handleChange}
                  >
                    {ordersLoading && (
                      <MenuItem disabled>
                        <CircularProgress size={20} /> Loading orders...
                      </MenuItem>
                    )}

                    {!ordersLoading &&
                      (Array.isArray(orders) ? orders : orders?.orders || []).map((o) => (
                        <MenuItem key={o._id} value={o._id}>
                          <ListAltIcon sx={{ mr: 1 }} />
                          {o.orderNumber || `Order ${o._id}`}
                        </MenuItem>
                      ))}

                    {!ordersLoading &&
                      (!orders || orders.length === 0) && (
                        <MenuItem disabled>No orders for this unit</MenuItem>
                      )}
                  </Select>
                </FormControl>
              </Grid>

              {/* STAGE DROPDOWN */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Stage</InputLabel>
                  <Select
                    name="stage"
                    value={formData.stage}
                    label="Stage"
                    onChange={handleChange}
                  >
                    {stageOptions.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        <BuildIcon sx={{ mr: 1 }} />
                        {stage}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* START DATE */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startedAt"
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startedAt}
                  onChange={handleChange}
                />
              </Grid>

              {/* COMPLETION DATE */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="completedAt"
                  type="date"
                  label="Completion Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.completedAt}
                  onChange={handleChange}
                />
              </Grid>

              {/* PROGRESS */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="progress"
                  type="number"
                  label="Progress (%)"
                  value={formData.progress}
                  onChange={handleChange}
                />
              </Grid>

              {/* REMARKS */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="remarks"
                  multiline
                  rows={3}
                  label="Remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </Grid>

              {/* SUBMIT BUTTON */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="success"
                  disabled={isLoading}
                  startIcon={<DoneAllIcon />}
                  sx={{ py: 1.5, fontSize: "1rem", mt: 1, borderRadius: 2 }}
                >
                  {isLoading ? "Saving..." : "Create Stage"}
                </Button>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProductionStageForm;
