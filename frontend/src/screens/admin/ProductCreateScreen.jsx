import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCreateProductMutation } from "../../slices/productApiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  sku: Yup.string().required("SKU is required"),
  category: Yup.string().required("Category is required"),
  unitCost: Yup.number().typeError("Must be a number").required("Cost is required"),
});

const ProductCreateScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [role, setRole] = useState(null);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // Set access control
  useEffect(() => {
    if (userInfo?.role) {
      setRole(userInfo.role);
      if (["admin", "client", "Unit Manager"].includes(userInfo.role)) {
        setAccessAllowed(true);
      }
    }
  }, [userInfo]);

  const formik = useFormik({
    initialValues: {
      name: "",
      sku: "",
      category: "",
      description: "",
      sizeRange: [],
      colorOptions: [],
      imageUrl: "",
      unitCost: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values };
        if (role === "client") payload.owner = userInfo._id;
        if (role === "Unit Manager") payload.unit = userInfo.unitId;

        await createProduct(payload).unwrap();
        setMessage("✅ Product created successfully!");
        setSeverity("success");
        setOpenSnack(true);
        resetForm();
      } catch (err) {
        setMessage(err?.data?.message || "❌ Failed to create product");
        setSeverity("error");
        setOpenSnack(true);
      }
    },
  });

  // Access restriction
  if (!accessAllowed) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="error">
          🚫 Access Denied
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Your role does not permit product creation. Contact admin for access.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        my: 4,
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, color: "primary.main", textAlign: "center", fontWeight: "bold" }}
        >
          🧵 {role === "admin" ? "Admin Product Creation" : "Add Product"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* Product Name */}
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />

          {/* SKU */}
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formik.values.sku}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sku && Boolean(formik.errors.sku)}
            helperText={formik.touched.sku && formik.errors.sku}
            margin="normal"
          />

          {/* Category */}
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            margin="normal"
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            multiline
            rows={3}
            margin="normal"
          />

          {/* Size Range */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Available Sizes
            </Typography>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <Chip
                key={size}
                label={size}
                color={formik.values.sizeRange.includes(size) ? "primary" : "default"}
                onClick={() => {
                  const newSizes = formik.values.sizeRange.includes(size)
                    ? formik.values.sizeRange.filter((s) => s !== size)
                    : [...formik.values.sizeRange, size];
                  formik.setFieldValue("sizeRange", newSizes);
                }}
                sx={{ mr: 1, mt: 1 }}
              />
            ))}
          </Box>

          {/* Color Options */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Color Options
            </Typography>
            {["Red", "Blue", "Green", "Black", "White"].map((color) => (
              <Chip
                key={color}
                label={color}
                color={formik.values.colorOptions.includes(color) ? "secondary" : "default"}
                onClick={() => {
                  const newColors = formik.values.colorOptions.includes(color)
                    ? formik.values.colorOptions.filter((c) => c !== color)
                    : [...formik.values.colorOptions, color];
                  formik.setFieldValue("colorOptions", newColors);
                }}
                sx={{ mr: 1, mt: 1 }}
              />
            ))}
          </Box>

          {/* Image URL */}
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            margin="normal"
          />

          {/* Unit Cost */}
          <TextField
            fullWidth
            label="Unit Cost"
            name="unitCost"
            type="number"
            value={formik.values.unitCost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.unitCost && Boolean(formik.errors.unitCost)}
            helperText={formik.touched.unitCost && formik.errors.unitCost}
            margin="normal"
          />

          {/* Role-based message */}
          {role === "client" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              🧍 You are creating a product for your own unit.
            </Typography>
          )}
          {role === "Unit Manager" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              🧑‍🏭 You are adding a product for your assigned unit.
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save Product"}
          </Button>
        </form>
      </Paper>

      {/* Snackbar Feedback */}
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnack(false)} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductCreateScreen;
