import { apiSlice } from './apiSlice';
import { PRODUCTS_URL } from '../constants';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get all products (public)
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get a product by ID (public)
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get products by category (public)
    getProductsByCategory: builder.query({
      query: (category) => ({
        url: `${PRODUCTS_URL}/category/${category}`,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get product by SKU (public)
    getProductBySKU: builder.query({
      query: (sku) => ({
        url: `${PRODUCTS_URL}/sku/${sku}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Create a new product (admin only)
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    // 🔹 Update an existing product (admin only)
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getCategories: builder.query({
  query: () => ({
    url: `${PRODUCTS_URL}/categories`,
  }),
  providesTags: ['Product'],
  keepUnusedDataFor: 5,
}),


    // 🔹 Delete a product (admin only)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetProductBySKUQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} = productApiSlice;
