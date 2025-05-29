import { apiSlice } from '../../store/api';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'AdminOrder', id },
        { type: 'AdminOrder', id: 'LIST' },
      ],
    }),
    getAdminOrders: builder.query({
      query: (params) => ({ url: '/admin/orders', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AdminOrder', id })),
              { type: 'AdminOrder', id: 'LIST' },
            ]
          : [{ type: 'AdminOrder', id: 'LIST' }],
    }),
    createOrder: builder.mutation({
      query: (newOrderData) => ({
        url: '/orders',
        method: 'POST',
        body: newOrderData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Order', id: 'LIST' }, 
        { type: 'CartItem', id: 'LIST' }
      ], 
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAdminOrdersQuery,
  useCreateOrderMutation,
  updateOrderItem: builder.mutation({
    query: ({ orderItemPublicId, quantity }) => ({
      url: `/orders-items/${orderItemPublicId}`,
      method: 'PUT',
      body: { quantity },
    }),
    invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
  }),
  removeOrderItem: builder.mutation({
    query: ({ orderItemPublicId }) => ({
      url: `/orders-items/${orderItemPublicId}`,
      method: 'DELETE',
    }),
    invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
  }),
} = orderApi;

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAdminOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderItemMutation, // Export new hook
  useRemoveOrderItemMutation, // Export new hook
} = orderApi;
