import { apiSlice } from '../../store/api';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => '/addresses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Address', id })),
              { type: 'Address', id: 'LIST' },
            ]
          : [{ type: 'Address', id: 'LIST' }],
    }),
    createAddress: builder.mutation({
      query: (newAddress) => ({
        url: '/addresses',
        method: 'POST',
        body: newAddress,
      }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    updateAddress: builder.mutation({
      query: ({ public_id, ...patch }) => ({
        url: `/addresses/${public_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { public_id }) => [{ type: 'Address', id: public_id }, { type: 'Address', id: 'LIST' }],
    }),
    deleteAddress: builder.mutation({
      query: (public_id) => ({
        url: `/addresses/${public_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, public_id) => [{ type: 'Address', id: public_id }, { type: 'Address', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
