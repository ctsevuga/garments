import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CategoryIcon from "@mui/icons-material/Category";
import MessageIcon from "@mui/icons-material/Message";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { toast } from "react-toastify";

import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
} from "../slices/notificationApiSlice";

const MyNotifications = () => {
  const { data: notifications, isLoading, refetch } = useGetMyNotificationsQuery();

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const [markAllChecked, setMarkAllChecked] = useState(false);

  // ▶ Mark Single Notification as Read
  const markReadHandler = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark as read");
    }
  };

  // ▶ Mark ALL Notifications as Read
  const markAllHandler = async (checked) => {
    setMarkAllChecked(checked);

    if (!checked) return;

    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark all");
    }
  };

  return (
    <Box sx={{ maxWidth: 750, margin: "auto", mt: 4, px: 2 }}>

      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <NotificationsActiveIcon color="primary" fontSize="large" />
        <Typography variant="h4" color="primary.dark" fontWeight="bold">
          My Notifications
        </Typography>
      </Box>

      {/* Mark ALL as Read Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={markAllChecked}
            onChange={(e) => markAllHandler(e.target.checked)}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
            color="success"
          />
        }
        label={
          <Typography variant="h6" color="success.dark">
            Mark All as Read
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && notifications?.length === 0 && (
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mt: 3, color: "error.main" }}
        >
          No notifications found
        </Typography>
      )}

      {/* Notification Cards */}
      {!isLoading &&
        notifications?.map((note) => (
          <Paper
            key={note._id}
            elevation={5}
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 3,
              background: note.isRead
                ? "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #ffffff 100%)"
                : "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffffff 100%)",
              borderLeft: note.isRead
                ? "6px solid #4caf50"
                : "6px solid #ff9800",
            }}
          >
            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
              <Box flex={1} pr={2}>
                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={note.isRead ? "success.dark" : "warning.dark"}
                  sx={{ mb: 1 }}
                >
                  {note.title}
                </Typography>

                {/* Message */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <MessageIcon sx={{ color: "#2e7d32" }} />
                  <Typography>{note.message}</Typography>
                </Box>

                {/* Type */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CategoryIcon sx={{ color: "#6a1b9a" }} />
                  <Typography>Type: {note.type}</Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Time */}
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon sx={{ color: "#0288d1" }} />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Action: Mark Single Read */}
              <Box display="flex" justifyContent="center" alignItems="center">
                {!note.isRead ? (
                  <Tooltip title="Mark as Read">
                    <IconButton
                      color="success"
                      onClick={() => markReadHandler(note._id)}
                    >
                      <MarkEmailUnreadIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Already Read">
                    <IconButton disabled>
                      <MarkEmailReadIcon sx={{ color: "#4caf50" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Paper>
        ))}
    </Box>
  );
};

export default MyNotifications;
