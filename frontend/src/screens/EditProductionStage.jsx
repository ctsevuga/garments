import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Button,
  LinearProgress,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetProductionStageByIdQuery,
  useUpdateProductionStageMutation,
} from "../slices/productionStageApiSlice";

import InventoryIcon from "@mui/icons-material/Inventory";
import FactoryIcon from "@mui/icons-material/Factory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PercentIcon from "@mui/icons-material/Percent";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

const stageColors = {
  Cutting: "#29b6f6",
  Stitching: "#ab47bc",
  Finishing: "#ef6c00",
  Packaging: "#8d6e63",
  Completed: "#2e7d32",
};

const EditProductionStage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: stage, isLoading, error } = useGetProductionStageByIdQuery(id);
  const [updateStage, { isLoading: isUpdating }] = useUpdateProductionStageMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stage: stage?.stage || "",
      progress: stage?.progress || 0,
      completedAt: stage?.completedAt
        ? new Date(stage.completedAt).toISOString().slice(0, 10)
        : "",
      remarks: stage?.remarks || "",
    },
    validationSchema: Yup.object({
      stage: Yup.string().required("Stage is required"),
      progress: Yup.number()
        .min(0, "Min 0%")
        .max(100, "Max 100%")
        .required("Progress is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateStage(values).unwrap();
        navigate("/productionStages");
      } catch (err) {
        console.error(err);
      }
    },
  });

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
          <InventoryIcon /> Edit Production Stage
        </Typography>
        <Typography align="center" sx={{ mt: 1 }} color="text.secondary">
          Order #{stage.order?.orderNumber}
        </Typography>
      </Card>

      {/* FORM CARD */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
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

              {/* ORDER */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <LocalShippingIcon /> Order
                </Typography>
                <Typography>Order #{stage.order?.orderNumber}</Typography>
                <Typography color="text.secondary" variant="body2">
                  Status: {stage.order?.status}
                </Typography>
              </Grid>

              {/* STAGE SELECTION */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Stage</Typography>
                <select
                  name="stage"
                  value={formik.values.stage}
                  onChange={formik.handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  {Object.keys(stageColors).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {formik.touched.stage && formik.errors.stage && (
                  <Typography color="error">{formik.errors.stage}</Typography>
                )}
              </Grid>

              {/* PROGRESS */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <PercentIcon /> Progress
                </Typography>
                <input
                  type="number"
                  name="progress"
                  value={formik.values.progress}
                  onChange={formik.handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <LinearProgress
                  variant="determinate"
                  value={formik.values.progress}
                  sx={{ mt: 1, height: 10, borderRadius: 5 }}
                  color="primary"
                />
              </Grid>

              {/* COMPLETED AT */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <AccessTimeFilledIcon /> Completed At
                </Typography>
                <input
                  type="date"
                  name="completedAt"
                  value={formik.values.completedAt}
                  onChange={formik.handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>

              {/* REMARKS */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <DoneAllIcon /> Remarks
                </Typography>
                <textarea
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>

              {/* SUBMIT BUTTON */}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Stage"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* BACK BUTTON */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Chip
          label="Back to List"
          onClick={() => navigate("/productionStageList")}
          color="secondary"
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

export default EditProductionStage;
