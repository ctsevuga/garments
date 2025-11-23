import { apiSlice } from './apiSlice';
import { NOTIFICATIONS_URL } from '../constants';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation({
      query: (data) => ({
        url: NOTIFICATIONS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getAllNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
      }),
      providesTags: ['Notification'],
      keepUnusedDataFor: 5,
    }),
    getMyNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/my`,
      }),
      keepUnusedDataFor: 5,
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/mark-all-read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetAllNotificationsQuery,
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;
