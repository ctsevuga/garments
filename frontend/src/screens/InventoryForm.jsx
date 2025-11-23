import React from "react";
import { useSelector } from "react-redux";
import { useCreateInventoryItemMutation } from "../slices/inventoryApiSlice";
import { useGetUnitsQuery } from "../slices/unitApiSlice";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AddCircleOutline,
  LocalShipping,
  Category,
  Storage,
} from "@mui/icons-material";
import * as Yup from "yup";

const InventoryForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createInventoryItem] = useCreateInventoryItemMutation();

  // 🌟 SINGLE QUERY (Backend handles role filtering)
  const { data: units = [], isLoading, isError, error } = useGetUnitsQuery();

  // 🌟 Validation Schema
  const validationSchema = Yup.object({
    unit: Yup.string().required("Unit is required"),
    itemName: Yup.string().required("Item name is required"),
    category: Yup.string().required("Category is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Must be positive"),
    unitOfMeasure: Yup.string().required("Unit of measure is required"),
    reorderLevel: Yup.number()
      .required("Reorder level is required")
      .positive("Must be positive"),
    supplierName: Yup.string(),
  });

  // 🌟 Form Submit
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await createInventoryItem(values);
      if (response.data) {
        alert("✅ Inventory item created successfully!");
        resetForm();
      }
    } catch (error) {
      alert("❌ Error creating inventory item");
    }
  };

  // 🌟 Loading State
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // 🌟 Error State
  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 4, mx: "auto", maxWidth: 400 }}>
        {error?.data?.message || "Failed to load units"}
      </Alert>
    );
  }

  // 🌟 Role-based color styling
  const roleColors = {
    admin: "primary",
    client: "success",
    "Unit Manager": "warning",
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color:
              userInfo.role === "admin"
                ? "#1976d2"
                : userInfo.role === "client"
                ? "#2e7d32"
                : "#ed6c02",
            fontWeight: "bold",
          }}
        >
          Add Inventory Item
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Role: <strong>{userInfo.role}</strong>
        </Typography>
      </Box>

      <Formik
        initialValues={{
          unit: "",
          itemName: "",
          category: "fabric",
          quantity: "",
          unitOfMeasure: "meters",
          reorderLevel: 10,
          supplierName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, touched, errors }) => (
          <Form>
            {/* UNIT DROPDOWN */}
            <Box sx={{ mb: 2 }}>
              <Field name="unit">
                {({ field }) => (
                  <FormControl
                    fullWidth
                    error={touched.unit && Boolean(errors.unit)}
                  >
                    <InputLabel>Unit</InputLabel>
                    <Select
                      {...field}
                      label="Unit"
                      value={values.unit}
                      onChange={handleChange}
                    >
                      {units.length > 0 ? (
                        units.map((u) => (
                          <MenuItem key={u._id} value={u._id}>
                            {u.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No available units</MenuItem>
                      )}
                    </Select>
                    <FormHelperText>
                      {touched.unit && errors.unit}
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
            </Box>

            {/* ITEM NAME */}
            <Box sx={{ mb: 2 }}>
              <Field name="itemName">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Item Name"
                    fullWidth
                    variant="outlined"
                    error={touched.itemName && Boolean(errors.itemName)}
                    helperText={touched.itemName && errors.itemName}
                    InputProps={{
                      startAdornment: (
                        <Category color={roleColors[userInfo.role]} />
                      ),
                    }}
                  />
                )}
              </Field>
            </Box>

            {/* CATEGORY */}
            <Box sx={{ mb: 2 }}>
              <Field name="category">
                {({ field }) => (
                  <FormControl
                    fullWidth
                    error={touched.category && Boolean(errors.category)}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      {...field}
                      label="Category"
                      value={values.category}
                      onChange={handleChange}
                    >
                      <MenuItem value="fabric">Fabric</MenuItem>
                      <MenuItem value="trim">Trim</MenuItem>
                      <MenuItem value="accessory">Accessory</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.category && errors.category}
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
            </Box>

            {/* QUANTITY */}
            <Box sx={{ mb: 2 }}>
              <Field name="quantity">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    InputProps={{
                      startAdornment: (
                        <Storage color={roleColors[userInfo.role]} />
                      ),
                    }}
                  />
                )}
              </Field>
            </Box>

            {/* UNIT OF MEASURE */}
            <Box sx={{ mb: 2 }}>
              <Field name="unitOfMeasure">
                {({ field }) => (
                  <FormControl
                    fullWidth
                    error={
                      touched.unitOfMeasure && Boolean(errors.unitOfMeasure)
                    }
                  >
                    <InputLabel>Unit of Measure</InputLabel>
                    <Select
                      {...field}
                      label="Unit of Measure"
                      value={values.unitOfMeasure}
                      onChange={handleChange}
                    >
                      <MenuItem value="meters">Meters</MenuItem>
                      <MenuItem value="pieces">Pieces</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.unitOfMeasure && errors.unitOfMeasure}
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
            </Box>

            {/* REORDER LEVEL */}
            <Box sx={{ mb: 2 }}>
              <Field name="reorderLevel">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Reorder Level"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={touched.reorderLevel && Boolean(errors.reorderLevel)}
                    helperText={touched.reorderLevel && errors.reorderLevel}
                    InputProps={{
                      startAdornment: (
                        <LocalShipping color={roleColors[userInfo.role]} />
                      ),
                    }}
                  />
                )}
              </Field>
            </Box>

            {/* SUPPLIER */}
            <Box sx={{ mb: 2 }}>
              <Field name="supplierName">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Supplier Name (optional)"
                    fullWidth
                    variant="outlined"
                  />
                )}
              </Field>
            </Box>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color={roleColors[userInfo.role] || "primary"}
              disabled={units.length === 0}
              sx={{
                padding: "12px 0",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "8px",
              }}
              startIcon={<AddCircleOutline />}
            >
              Add Inventory
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default InventoryForm;
