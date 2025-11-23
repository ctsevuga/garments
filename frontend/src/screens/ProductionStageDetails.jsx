import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";

import FactoryIcon from "@mui/icons-material/Factory";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PercentIcon from "@mui/icons-material/Percent";

import { useParams, useNavigate } from "react-router-dom";
import { useGetProductionStageByIdQuery } from "../slices/productionStageApiSlice";

const stageColors = {
  Cutting: "#29b6f6",
  Stitching: "#ab47bc",
  Finishing: "#ef6c00",
  Packaging: "#8d6e63",
  Completed: "#2e7d32",
};

const ProductionStageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: stage, isLoading, error } = useGetProductionStageByIdQuery(id);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress size={55} />
        <Typography sx={{ mt: 2 }}>Loading Stage Details...</Typography>
      </Box>
    );
  }

  if (error || !stage) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error" variant="h6">
          Production Stage Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, p: 2 }}>

      {/* HEADER */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(120deg, ${stageColors[stage.stage]}33, #ffffff)`,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ display: "flex", justifyContent: "center", gap: 1 }}
        >
          <InventoryIcon /> Production Stage Details
        </Typography>

        <Typography align="center" sx={{ mt: 1 }} color="text.secondary">
          Order #{stage.order?.orderNumber}
        </Typography>
      </Card>

      {/* DETAILS CARD */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={3}>

            {/* UNIT */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                <FactoryIcon /> Unit
              </Typography>
              <Typography>{stage.unit?.name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {stage.unit?.city}
              </Typography>
            </Grid>

            {/* ORDER SECTION */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                <LocalShippingIcon /> Order
              </Typography>
              <Typography>Order #{stage.order?.orderNumber}</Typography>
              <Typography color="text.secondary" variant="body2">
                Status: {stage.order?.status}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* STAGE + PROGRESS */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Stage</Typography>

              <Chip
                label={stage.stage}
                sx={{
                  backgroundColor: stageColors[stage.stage],
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              />

              <Typography sx={{ mt: 2, display: "flex", gap: 1 }}>
                <PercentIcon /> Progress:{" "}
                <strong>{stage.progress}%</strong>
              </Typography>
            </Grid>

            {/* DATES */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                <AccessTimeFilledIcon /> Timeline
              </Typography>

              <Typography>
                Started:{" "}
                {new Date(stage.startedAt).toLocaleDateString()}
              </Typography>

              <Typography>
                Completed:{" "}
                {stage.completedAt
                  ? new Date(stage.completedAt).toLocaleDateString()
                  : "Not yet completed"}
              </Typography>
            </Grid>

            {/* REMARKS */}
            {stage.remarks && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <DoneAllIcon /> Remarks
                </Typography>
                <Typography sx={{ mt: 1 }}>{stage.remarks}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* BACK BUTTON */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Chip
          label="Back to List"
          onClick={() => navigate("/productionStageList")}
          color="primary"
          sx={{
            px: 3,
            py: 2,
            fontSize: "1rem",
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductionStageDetails;
