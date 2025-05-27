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
  }),
});

export const {
  useGetDefaultOrdersQuery,
  useCreateDefaultOrderMutation,
} = defaultOrderApi;
