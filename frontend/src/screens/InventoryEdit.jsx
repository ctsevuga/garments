import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  MdCategory,
  MdInventory,
  MdOutlineStraighten,
  MdLocalShipping,
  MdEdit,
  MdSave,
  MdArrowBack,
} from "react-icons/md";
import { useGetInventoryByIdQuery, useUpdateInventoryItemMutation } from "../slices/inventoryApiSlice";

const InventoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch the inventory item by ID
  const { data: item, isLoading, isError } = useGetInventoryByIdQuery(id);

  // RTK Mutation for updating
  const [updateInventoryItem, { isLoading: updating }] = useUpdateInventoryItemMutation();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unitOfMeasure: "",
    reorderLevel: "",
    supplierName: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || "",
        category: item.category || "fabric",
        quantity: item.quantity || 0,
        unitOfMeasure: item.unitOfMeasure || "meters",
        reorderLevel: item.reorderLevel || 10,
        supplierName: item.supplierName || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateInventoryItem({ id, ...formData }).unwrap();
      toast.success("✅ Inventory updated successfully!");
      navigate(`/inventory/view/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || "❌ Update failed");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !item) {
    return (
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          ⚠️ Inventory item not found
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          borderRadius: 3,
          boxShadow: 6,
          backgroundColor: "white",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            <MdEdit style={{ marginRight: 8, verticalAlign: "middle" }} />
            Edit Inventory Item
          </Typography>
          <Button
            startIcon={<MdArrowBack />}
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Item Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="itemName"
                label="Item Name"
                value={formData.itemName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <MdInventory color={theme.palette.primary.main} style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <MdCategory color={theme.palette.secondary.main} style={{ marginRight: 8 }} />,
                }}
              >
                <MenuItem value="fabric">Fabric</MenuItem>
                <MenuItem value="trim">Trim</MenuItem>
                <MenuItem value="accessory">Accessory</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="quantity"
                label="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <MdOutlineStraighten color={theme.palette.success.main} style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            {/* Unit of Measure */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="unitOfMeasure"
                label="Unit of Measure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
              />
            </Grid>

            {/* Reorder Level */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="reorderLevel"
                label="Reorder Level"
                value={formData.reorderLevel}
                onChange={handleChange}
              />
            </Grid>

            {/* Supplier */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="supplierName"
                label="Supplier Name"
                value={formData.supplierName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <MdLocalShipping color={theme.palette.info.main} style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<MdSave />}
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
};

export default InventoryEdit;
