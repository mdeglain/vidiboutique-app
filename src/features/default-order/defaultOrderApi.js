import { apiSlice } from '../../store/api';

export const defaultOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDefaultOrders: builder.query({
      query: () => '/default-orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DefaultOrder', id })),
              { type: 'DefaultOrder', id: 'LIST' },
            ]
          : [{ type: 'DefaultOrder', id: 'LIST' }],
    }),
    createDefaultOrder: builder.mutation({
      query: (newDefaultOrder) => ({
        url: '/default-orders',
        method: 'POST',
        body: newDefaultOrder,
      }),
      invalidatesTags: [{ type: 'DefaultOrder', id: 'LIST' }],
    }),
    getDefaultOrderById: builder.query({
      query: (id) => `/default-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'DefaultOrder', id }],
    }),
    updateDefaultOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/default-orders/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DefaultOrder', id }, { type: 'DefaultOrder', id: 'LIST' }],
    }),
    deleteDefaultOrder: builder.mutation({
      query: (id) => ({
        url: `/default-orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'DefaultOrder', id }, { type: 'DefaultOrder', id: 'LIST' }],
    }),
    addItemToDefaultOrderList: builder.mutation({
      query: ({ orderPublicId, itemData }) => ({ // itemData: { product_id, quantity }
        url: `/default-orders/${orderPublicId}/items`,
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: (result, error, { orderPublicId }) => [{ type: 'DefaultOrder', id: orderPublicId }, { type: 'DefaultOrder', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDefaultOrdersQuery,
  useCreateDefaultOrderMutation,
  useGetDefaultOrderByIdQuery,
  useUpdateDefaultOrderMutation,
  useDeleteDefaultOrderMutation,
  useAddItemToDefaultOrderListMutation, // Export the new hook
} = defaultOrderApi;
