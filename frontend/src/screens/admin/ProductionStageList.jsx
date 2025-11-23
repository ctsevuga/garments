import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Slider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import FactoryIcon from "@mui/icons-material/Factory";
import PercentIcon from "@mui/icons-material/Percent";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import { useGetUnitsQuery } from "../../slices/unitApiSlice";
import { useGetOrdersByUnitQuery } from "../../slices/orderApiSlice";
import {
  useGetAllProductionStagesQuery,
  useDeleteProductionStageMutation,
} from "../../slices/productionStageApiSlice";

const stageOptions = ["Cutting", "Stitching", "Finishing", "Packaging", "Completed"];
const typeOptions = ["Regular", "Urgent", "Sample"]; // adjustable types

// Colors for stages
const stageColors = {
  Cutting: "primary",
  Stitching: "secondary",
  Finishing: "success",
  Packaging: "warning",
  Completed: "default",
};

const ProductionStageList = () => {
  const navigate = useNavigate();
  const [deleteStage] = useDeleteProductionStageMutation();

  // FILTER STATE
  const [filters, setFilters] = useState({
    unit: "",
    order: "",
    stage: "",
    type: "",
    startDate: "",
    endDate: "",
    progressMin: 0,
    progressMax: 100,
  });

  // Fetch units
  const { data: units } = useGetUnitsQuery();

  // Fetch orders based on selected unit
  const { data: orders } = useGetOrdersByUnitQuery(filters.unit, {
    skip: !filters.unit,
  });

  // Fetch stages based on filters
  const { data, isLoading } = useGetAllProductionStagesQuery(filters);

  // Handle filter change
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle delete stage
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stage?")) {
      try {
        await deleteStage(id).unwrap();
        alert("Stage deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to delete stage");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 2 }}>

      {/* HEADER + CREATE BUTTON */}
      <Card
        sx={{
          background: "linear-gradient(120deg, #e3f2fd, #ffe0b2)",
          borderRadius: 3,
          mb: 3,
          p: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ display: "flex", justifyContent: "center", gap: 1 }}
        >
          <AssignmentIcon /> Production Stage Management
        </Typography>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate("/productionStage")}
          >
            Create Production Stage
          </Button>
        </Box>
      </Card>

      {/* FILTER PANEL */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <Grid container spacing={2}>

            {/* UNIT */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={filters.unit}
                  label="Unit"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      unit: e.target.value,
                      order: "", // reset order dropdown
                    })
                  }
                >
                  {units?.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      <FactoryIcon sx={{ mr: 1 }} /> {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ORDER */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!filters.unit}>
                <InputLabel>Order</InputLabel>
                <Select
                  name="order"
                  value={filters.order}
                  label="Order"
                  onChange={handleChange}
                >
                  {orders?.map((o) => (
                    <MenuItem key={o._id} value={o._id}>
                      Order #{o.orderNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* STAGE */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  name="stage"
                  value={filters.stage}
                  label="Stage"
                  onChange={handleChange}
                >
                  {stageOptions.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* TYPE */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  label="Type"
                  onChange={handleChange}
                >
                  {typeOptions.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* DATE RANGE */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={handleChange}
              />
            </Grid>

            {/* PROGRESS */}
            <Grid item xs={12}>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PercentIcon /> Progress Range
              </Typography>

              <Slider
                value={[filters.progressMin, filters.progressMax]}
                onChange={(e, val) =>
                  setFilters({ ...filters, progressMin: val[0], progressMax: val[1] })
                }
                valueLabelDisplay="auto"
                step={5}
                min={0}
                max={100}
              />
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* TABLE LIST */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Production Stages
          </Typography>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: "#eeeeee" }}>
                <TableRow>
                  <TableCell>Unit</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.stages?.length > 0 ? (
                  data.stages.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.unit?.name}</TableCell>
                      <TableCell>{s.order?.orderNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={s.stage}
                          color={stageColors[s.stage] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{s.progress}%</TableCell>
                      <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/productionStage/view/${s._id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/productionStage/edit/${s._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(s._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductionStageList;
