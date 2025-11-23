import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SendIcon from "@mui/icons-material/Send";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import { useCreateNotificationMutation } from "../../slices/notificationApiSlice";
import { toast } from "react-toastify";

const NotificationCreateForm = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [createNotification, { isLoading: creating }] =
    useCreateNotificationMutation();

  const [formData, setFormData] = useState({
    user: "",
    title: "",
    message: "",
    type: "system",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createNotification(formData).unwrap();
      toast.success("Notification created successfully!");
      setFormData({ user: "", title: "", message: "", type: "system" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create notification");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #e8f5e9 100%)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <NotificationsActiveIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            Create Notification
          </Typography>
        </Box>

        <form onSubmit={submitHandler}>
          {/* User Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="user-label">Select User</InputLabel>
            <Select
              labelId="user-label"
              name="user"
              value={formData.user}
              label="Select User"
              onChange={handleChange}
              required
            >
              {usersLoading ? (
                <MenuItem disabled>Loading users...</MenuItem>
              ) : (
                users?.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name} — {u.email}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          {/* Message */}
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            required
          />

          {/* Type */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="type-label">Notification Type</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={formData.type}
              label="Notification Type"
              onChange={handleChange}
            >
              <MenuItem value="order">Order</MenuItem>
              <MenuItem value="inventory">Inventory</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            color="success"
            type="submit"
            disabled={creating}
            startIcon={!creating && <SendIcon />}
            sx={{
              py: 1.2,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {creating ? <CircularProgress size={24} color="inherit" /> : "Send Notification"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default NotificationCreateForm;
