// src/slices/unitApiSlice.js
import { apiSlice } from './apiSlice';
import { UNITS_URL } from '../constants';

export const unitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all units (admin only)
    getUnits: builder.query({
      query: () => ({
        url: UNITS_URL,
      }),
      providesTags: ['Unit'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get active units (for logged-in users)
    getActiveUnits: builder.query({
      query: () => ({
        url: `${UNITS_URL}/active`, // Use UNITS_URL constant and append the path
      }),
      providesTags: ['Unit'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get units by owner (for logged-in users)
    getUnitsByOwner: builder.query({
      query: (ownerId) => ({
        url: `${UNITS_URL}/owner/${ownerId}`, // Use UNITS_URL constant and append ownerId
      }),
      providesTags: ['Unit'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get a single unit by ID (admin only)
    getUnitById: builder.query({
      query: (id) => ({
        url: `${UNITS_URL}/${id}`, // Use UNITS_URL constant and append unit id
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Create a new unit (admin only)
    createUnit: builder.mutation({
      query: (data) => ({
        url: UNITS_URL, // Use UNITS_URL constant
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Unit'],
    }),

    // 🔹 Update a unit (admin only)
    updateUnit: builder.mutation({
      query: (data) => ({
        url: `${UNITS_URL}/${data.id}`, // Use UNITS_URL constant and append unit id
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Unit'],
    }),

    // 🔹 Delete a unit (admin only)
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `${UNITS_URL}/${id}`, // Use UNITS_URL constant and append unit id
        method: 'DELETE',
      }),
      invalidatesTags: ['Unit'],
    }),

    
  }),
});

// ✅ Export generated hooks
export const {
  useGetUnitsQuery,
  useGetActiveUnitsQuery,
  useGetUnitsByOwnerQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  
} = unitApiSlice;
