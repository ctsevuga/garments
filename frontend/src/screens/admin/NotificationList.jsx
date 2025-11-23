import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import MessageIcon from "@mui/icons-material/Message";

import { toast } from "react-toastify";

import {
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
} from "../../slices/notificationApiSlice";

import { useGetUsersQuery } from "../../slices/usersApiSlice";

const NotificationList = () => {
  const { data: notifications, isLoading } = useGetAllNotificationsQuery();
  const { data: users } = useGetUsersQuery();

  const [deleteNotification] = useDeleteNotificationMutation();
  const [markRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllAsReadMutation();

  const [selectedUser, setSelectedUser] = useState("");
  const [markAllChecked, setMarkAllChecked] = useState(false);

  // Filter notifications by selected user
  const filteredNotifications = selectedUser
    ? notifications?.filter((n) => n.user?._id === selectedUser)
    : notifications;

  // Handler: Delete single notification
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(id).unwrap();
        toast.success("Notification deleted");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete");
      }
    }
  };

  // Handler: Mark single as read
  const markAsReadHandler = async (id) => {
    try {
      await markRead(id).unwrap();
      toast.success("Marked as read");
    } catch (err) {
      toast.error(err?.data?.message || "Unable to mark as read");
    }
  };

  // Handler: Mark ALL as read
  const handleMarkAllAsRead = async (checked) => {
    setMarkAllChecked(checked);

    if (!checked) return; // Only act when user checks the box

    try {
      await markAllRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(err?.data?.message || "Unable to mark all as read");
    }

    // Reset checkbox after action
    setTimeout(() => setMarkAllChecked(false), 500);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4, px: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <NotificationsActiveIcon color="primary" fontSize="large" />
        <Typography variant="h4" color="primary.dark">
          Notifications
        </Typography>
      </Box>

      {/* User Filter Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>User Filter</InputLabel>
        <Select
          value={selectedUser}
          label="User Filter"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <MenuItem value="">All Users</MenuItem>
          {users?.map((u) => (
            <MenuItem key={u._id} value={u._id}>
              {u.name} — {u.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Mark ALL as Read checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={markAllChecked}
            onChange={(e) => handleMarkAllAsRead(e.target.checked)}
            color="success"
            size="medium"
          />
        }
        label={
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Mark All as Read
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredNotifications?.length === 0 ? (
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mt: 3, color: "error.main" }}
        >
          No notifications found
        </Typography>
      ) : (
        filteredNotifications.map((note) => (
          <Paper
            key={note._id}
            elevation={4}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              background: note.isRead
                ? "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #ffffff 100%)"
                : "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffffff 100%)",
              borderLeft: note.isRead ? "6px solid #43a047" : "6px solid #ff9800",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              gap={1}
            >
              <Box flex={1}>
                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={note.isRead ? "success.dark" : "warning.dark"}
                >
                  {note.title}
                </Typography>

                {/* Message */}
                <Box display="flex" alignItems="center" mt={1}>
                  <MessageIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#2e7d32" }}
                  />
                  <Typography>{note.message}</Typography>
                </Box>

                {/* Type */}
                <Box display="flex" alignItems="center" mt={1}>
                  <CategoryIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#0288d1" }}
                  />
                  <Typography>Type: {note.type}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* User Info */}
                <Box display="flex" alignItems="center" mt={1}>
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#6a1b9a" }}
                  />
                  <Typography>
                    {note.user?.name} ({note.user?.email}) — {note.user?.phone} —{" "}
                    {note.user?.role}
                  </Typography>
                </Box>

                {/* Date */}
                <Typography variant="caption" color="text.secondary">
                  {new Date(note.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {/* ACTION BUTTONS */}
              <Box display="flex" flexDirection="column">
                {/* Mark as Read Button */}
                {!note.isRead && (
                  <Tooltip title="Mark as Read">
                    <IconButton
                      color="success"
                      onClick={() => markAsReadHandler(note._id)}
                    >
                      <MarkEmailUnreadIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {note.isRead && (
                  <Tooltip title="Already Read">
                    <IconButton disabled>
                      <MarkEmailReadIcon sx={{ color: "#43a047" }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Delete Button */}
                <Tooltip title="Delete Notification">
                  <IconButton
                    color="error"
                    onClick={() => deleteHandler(note._id)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default NotificationList;
