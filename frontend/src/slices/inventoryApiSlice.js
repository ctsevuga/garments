import { apiSlice } from './apiSlice';
import { INVENTORIES_URL } from '../constants';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInventoryItem: builder.mutation({
      query: (data) => ({
        url: INVENTORIES_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getAllInventory: builder.query({
      query: () => ({
        url: INVENTORIES_URL,
      }),
      providesTags: ['Inventory'],
      keepUnusedDataFor: 5,
    }),
    getInventoryById: builder.query({
      query: (id) => ({
        url: `${INVENTORIES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateInventoryItem: builder.mutation({
      query: (data) => ({
        url: `${INVENTORIES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Inventory'],
    }),
    deleteInventoryItem: builder.mutation({
      query: (id) => ({
        url: `${INVENTORIES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],
    }),
    getInventoryCategories: builder.query({
  query: () => ({
    url: `${INVENTORIES_URL}/categories`,
  }),
  providesTags: ['Inventory'],
  keepUnusedDataFor: 5,
}),
    getInventoryByUnit: builder.query({
      query: (unitId) => ({
        url: `${INVENTORIES_URL}/unit/${unitId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getInventoryByCategory: builder.query({
      query: (category) => ({
        url: `${INVENTORIES_URL}/category/${category}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getLowStockItems: builder.query({
      query: () => ({
        url: `${INVENTORIES_URL}/lowstock`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateInventoryItemMutation,
  useGetAllInventoryQuery,
  useGetInventoryByIdQuery,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useGetInventoryByUnitQuery,
  useGetInventoryByCategoryQuery,
  useGetLowStockItemsQuery,
  useGetInventoryCategoriesQuery,
} = inventoryApiSlice;
