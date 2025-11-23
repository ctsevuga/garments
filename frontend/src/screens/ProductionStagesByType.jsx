import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  GiCutDiamond,
  GiSewingMachine,
  GiClothes,
  GiCardboardBox,
  GiCheckMark,
} from "react-icons/gi";

import { useGetUnitsQuery } from "../slices/unitApiSlice";
import { useGetStagesByTypeQuery } from "../slices/productionStageApiSlice";

const stageList = ["Cutting", "Stitching", "Finishing", "Packaging", "Completed"];

const stageIcons = {
  Cutting: <GiCutDiamond size={28} color="#e74c3c" />,
  Stitching: <GiSewingMachine size={28} color="#2980b9" />,
  Finishing: <GiClothes size={28} color="#2ecc71" />,
  Packaging: <GiCardboardBox size={28} color="#f1c40f" />,
  Completed: <GiCheckMark size={30} color="#2c3e50" />,
};

const stageColors = {
  Cutting: "error",
  Stitching: "primary",
  Finishing: "success",
  Packaging: "warning",
  Completed: "secondary",
};

const ProductionStagesByType = () => {
  const [selectedStage, setSelectedStage] = useState("");

  // Fetch units (informational only)
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();

  // Fetch stages by type
  const {
    data: stages,
    isLoading: stagesLoading,
    isError,
    error,
  } = useGetStagesByTypeQuery(selectedStage, { skip: !selectedStage });

  return (
    <Box sx={{ padding: "1rem", maxWidth: 1100, mx: "auto" }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        🧵 Production Stages by Type
      </Typography>

      {/* UNIT INFORMATION DROPDOWN (not filtering) */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Available Units </InputLabel>
        <Select label="Available Units (Info Only)" defaultValue="">
          {unitsLoading && <MenuItem>Loading Units...</MenuItem>}
          {units &&
            units.map((unit) => (
              <MenuItem key={unit._id} value={unit._id}>
                🏭 {unit.name} — {unit.city}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* STAGE TYPE DROPDOWN */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Stage Type</InputLabel>
        <Select
          value={selectedStage}
          label="Select Stage Type"
          onChange={(e) => setSelectedStage(e.target.value)}
        >
          {stageList.map((stg) => (
            <MenuItem key={stg} value={stg}>
              {stageIcons[stg]} &nbsp; {stg}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loading State */}
      {stagesLoading && selectedStage && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
          <Typography>Loading stages...</Typography>
        </Box>
      )}

      {/* Error State */}
      {isError && selectedStage && (
        <Typography sx={{ textAlign: "center", color: "red", mt: 2 }}>
          {error?.data?.message || "Error loading data"}
        </Typography>
      )}

      {/* Stages Display */}
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
                  boxShadow: 3,
                  background: "linear-gradient(to right, #ffffff, #f7f7f7)",
                  height: "100%",
                }}
              >
                <Box sx={{ mr: 2 }}>{stageIcons[stage.stage]}</Box>

                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6">{stage.stage}</Typography>

                  <Chip
                    label={`${stage.progress}%`}
                    color={stageColors[stage.stage]}
                    sx={{ mt: 1, fontWeight: "bold" }}
                  />

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Order:</strong> {stage.order?.orderNumber}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Status:</strong> {stage.order?.status}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Unit:</strong> {stage.unit?.name}
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
                      sx={{
                        mt: 1,
                        fontStyle: "italic",
                        color: "gray",
                      }}
                    >
                      "{stage.remarks}"
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* No Data */}
      {selectedStage && !stagesLoading && stages?.length === 0 && (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          No stages found.
        </Typography>
      )}
    </Box>
  );
};

export default ProductionStagesByType;
