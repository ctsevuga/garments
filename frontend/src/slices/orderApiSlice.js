import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Create a new order
    createOrder: builder.mutation({
      query: (data) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    // 🔹 Get all orders
    getAllOrders: builder.query({
  query: ({ client, status, startDate, endDate, page = 1, limit = 10 } = {}) => ({
    url: ORDERS_URL,
    params: {
      client,
      status,
      startDate,
      endDate,
      page,
      limit,
    },
  }),
  providesTags: ['Order'],
  keepUnusedDataFor: 5,
}),

    // 🔹 Get order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Update an order
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    // 🔹 Delete an order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),

    // 🔹 Get all orders for a specific client
   getOrdersByClient: builder.query({
      query: ({ status, startDate, endDate, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        params.append("page", page);
        params.append("limit", limit);

        return {
          url: `${ORDERS_URL}/client?${params.toString()}`, // clientId removed
        };
      },
      providesTags: ["Order"],
    }),



    // 🔹 Get all orders for a specific unit
    getOrdersByUnit: builder.query({
      query: (unitId) => ({
        url: `${ORDERS_URL}/unit/${unitId}`,
      }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get orders by status
    getOrdersByStatus: builder.query({
  query: ({ status, unit }) => {
    let url = `${ORDERS_URL}/status/${status}`;
    if (unit) {
      url += `?unit=${unit}`;
    }
    return { url };
  },
  providesTags: ["Order"],
  keepUnusedDataFor: 5,
}),

  }),
});

// ✅ Export hooks for components
export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetOrdersByClientQuery,
  useGetOrdersByUnitQuery,
  useGetOrdersByStatusQuery,
} = orderApiSlice;
