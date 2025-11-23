import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  GiCutDiamond,
  GiSewingMachine,
  GiClothes,
  GiCardboardBox,
  GiCheckMark,
} from "react-icons/gi";

import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

import { useGetUnitsQuery } from "../slices/unitApiSlice";
import {
  useGetStagesByUnitQuery,
  useDeleteProductionStageMutation,
} from "../slices/productionStageApiSlice";

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

const ProductionStagesByUnit = () => {
  const [selectedUnit, setSelectedUnit] = useState("");

  const navigate = useNavigate();

  // Fetch Units
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  // Fetch Stages based on selected Unit
  const {
    data: stages,
    isLoading: stagesLoading,
    refetch: refetchStages,
  } = useGetStagesByUnitQuery(selectedUnit, {
    skip: !selectedUnit,
  });

  // Delete mutation
  const [deleteStage] = useDeleteProductionStageMutation();

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stage?")) return;

    try {
      await deleteStage(id).unwrap();
      toast.success("Stage deleted successfully");
      refetchStages();
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  return (
    <Box sx={{ padding: "1rem", maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        🏭 Unit Production Stages
      </Typography>

      {/* UNIT DROPDOWN */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Unit</InputLabel>
        <Select
          value={selectedUnit}
          label="Select Unit"
          onChange={(e) => {
            setSelectedUnit(e.target.value);
          }}
        >
          {unitsLoading && <MenuItem>Loading units...</MenuItem>}
          {units &&
            units.map((unit) => (
              <MenuItem key={unit._id} value={unit._id}>
                🏭 {unit.name} — {unit.city}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* SHOW LOADING */}
      {selectedUnit && stagesLoading && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography>Loading Production Stages...</Typography>
        </Box>
      )}

      {/* NO STAGES */}
      {selectedUnit && !stagesLoading && stages?.length === 0 && (
        <Typography sx={{ textAlign: "center", mt: 2, color: "red" }}>
          No production stages found for this unit.
        </Typography>
      )}

      {/* PRODUCTION STAGES GRID */}
      <Grid container spacing={2}>
        {stages &&
          stages.map((stage) => (
            <Grid item xs={12} sm={6} md={4} key={stage._id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 4,
                  background: "linear-gradient(to right, #ffffff, #f7f7f7)",
                }}
              >
                <Box sx={{ mr: 2 }}>{stageIcons[stage.stage]}</Box>

                <CardContent sx={{ p: 0, flexGrow: 1 }}>
                  <Typography variant="h6">{stage.stage}</Typography>

                  <Chip
                    label={`${stage.progress}% Complete`}
                    color={stageColors[stage.stage]}
                    sx={{ mt: 1, fontWeight: "bold" }}
                  />

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Order: {stage.order?.orderNumber}
                  </Typography>

                  <Typography variant="body2">
                    Client: {stage.order?.client}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Started: {new Date(stage.startedAt).toLocaleString()}
                  </Typography>

                  {stage.completedAt && (
                    <Typography variant="body2">
                      Completed:{" "}
                      {new Date(stage.completedAt).toLocaleString()}
                    </Typography>
                  )}

                  {stage.remarks && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "gray", fontStyle: "italic" }}
                    >
                      “{stage.remarks}”
                    </Typography>
                  )}
                </CardContent>

                {/* ACTION BUTTONS */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/stages/view/${stage._id}`)}
                  >
                    <FaEye />
                  </IconButton>

                  <IconButton
                    color="success"
                    onClick={() => navigate(`/stages/edit/${stage._id}`)}
                  >
                    <FaEdit />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(stage._id)}
                  >
                    <FaTrash />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default ProductionStagesByUnit;
