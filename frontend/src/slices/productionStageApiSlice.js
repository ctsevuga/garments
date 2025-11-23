import { apiSlice } from './apiSlice';
import { PRODUCTIONSTAGES_URL } from '../constants';

export const productionStageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Create a new production stage
    createProductionStage: builder.mutation({
      query: (data) => ({
        url: PRODUCTIONSTAGES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductionStage'],
    }),

    // 🔹 Get all production stages (admin only)
    getAllProductionStages: builder.query({
  query: (params) => ({
    url: PRODUCTIONSTAGES_URL,
    method: "GET",
    params: params, // attaches ?unit=xxx&stage=Cutting etc.
  }),
  providesTags: ["ProductionStage"],
  keepUnusedDataFor: 5,
}),


    // 🔹 Get a single production stage by ID
    getProductionStageById: builder.query({
      query: (id) => ({
        url: `${PRODUCTIONSTAGES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Update a production stage
    updateProductionStage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTIONSTAGES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ProductionStage'],
    }),

    // 🔹 Delete a production stage
    deleteProductionStage: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTIONSTAGES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductionStage'],
    }),

    // 🔹 Get stages by Order
    getStagesByOrder: builder.query({
      query: (orderId) => ({
        url: `${PRODUCTIONSTAGES_URL}/order/${orderId}`,
      }),
      providesTags: ['ProductionStage'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get stages by Unit
    getStagesByUnit: builder.query({
      query: (unitId) => ({
        url: `${PRODUCTIONSTAGES_URL}/unit/${unitId}`,
      }),
      providesTags: ['ProductionStage'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get stages by Type
    getStagesByType: builder.query({
      query: (stageType) => ({
        url: `${PRODUCTIONSTAGES_URL}/type/${stageType}`,
      }),
      providesTags: ['ProductionStage'],
      keepUnusedDataFor: 5,
    }),
  }),
});

// ✅ Export hooks for use in components
export const {
  useCreateProductionStageMutation,
  useGetAllProductionStagesQuery,
  useGetProductionStageByIdQuery,
  useUpdateProductionStageMutation,
  useDeleteProductionStageMutation,
  useGetStagesByOrderQuery,
  useGetStagesByUnitQuery,
  useGetStagesByTypeQuery,
} = productionStageApiSlice;
