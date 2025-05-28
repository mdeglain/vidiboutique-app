import { apiSlice } from '../../store/api';

export const favoriteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavoriteProducts: builder.query({
      query: () => '/users-favorite-products',
      providesTags: (result) =>
        result && result.data // Assuming the actual favorite items are in result.data
          ? [
              ...result.data.map(({ product_id }) => ({ type: 'FavoriteProduct', id: product_id })), // Assuming product_id is the unique key for a favorite
              { type: 'FavoriteProduct', id: 'LIST' },
            ]
          : [{ type: 'FavoriteProduct', id: 'LIST' }],
    }),
    addFavorite: builder.mutation({
      query: ({ product_id }) => ({
        url: '/users-favorite-products',
        method: 'POST',
        body: { product_id },
      }),
      // Invalidate product list and individual product if it's fetched by an ID that might show favorite status
      invalidatesTags: (result, error, { product_id }) => [
        { type: 'FavoriteProduct', id: 'LIST' },
        { type: 'Product', id: product_id } // To refetch the specific product
      ],
    }),
    removeFavorite: builder.mutation({
      query: ({ product_id }) => ({
        url: '/users-favorite-products',
        method: 'DELETE',
        body: { product_id }, // Backend expects product_id in body for DELETE
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: 'FavoriteProduct', id: 'LIST' },
        { type: 'Product', id: product_id } // To refetch the specific product
      ],
    }),
  }),
  // Note: `tagTypes` should be in the main apiSlice definition.
  // This will be addressed in Part 2 by adding 'FavoriteProduct' to src/store/api.js
});

export const {
  useGetFavoriteProductsQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;
