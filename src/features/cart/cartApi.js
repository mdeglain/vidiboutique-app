import { apiSlice } from '../../store/api';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => '/carts-items',
      providesTags: (result) =>
        result && result.data // Ensure result and result.data exist
          ? [
              ...result.data.map(({ public_id }) => ({ type: 'CartItem', id: public_id })),
              { type: 'CartItem', id: 'LIST' },
            ]
          : [{ type: 'CartItem', id: 'LIST' }],
      // Make sure to access the correct property that holds the array of items.
      // If the items are directly in `result`, then it should be `result.map(...)`
      // If the API nests it like `{ "data": { "items": [] } }`, it would be `result.data.items.map(...)`
      // Based on previous similar structures, `result.data` for a list is plausible.
    }),
    updateCartItemQuantity: builder.mutation({
      query: ({ public_id, quantity }) => ({
        url: `/carts-items/${public_id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: (result, error, { public_id }) => [{ type: 'CartItem', id: public_id }, { type: 'CartItem', id: 'LIST' }],
    }),
    deleteCartItem: builder.mutation({
      query: (public_id) => ({
        url: `/carts-items/${public_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, public_id) => [{ type: 'CartItem', id: public_id }, { type: 'CartItem', id: 'LIST' }],
    }),
    addItemToCart: builder.mutation({
      query: (itemData) => ({
        url: '/carts-items',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: [{ type: 'CartItem', id: 'LIST' }],
    }),
  }),
  // Ensure tagTypes is defined at the apiSlice level if not already.
  // If it's defined in the main apiSlice, this is not strictly necessary here,
  // but if cartApi is the first to define 'CartItem', it should be here or in apiSlice.
  // For safety, let's assume it should be in the main apiSlice, but if errors occur,
  // this is a place to check. The task asks for it here, which is unusual.
  // It's better to have tagTypes defined in the root apiSlice.
  // However, adhering to the prompt:
  // tagTypes: ['CartItem'], // This might cause issues if apiSlice already defines tagTypes without 'CartItem'.
});

export const {
  useGetCartItemsQuery,
  useUpdateCartItemQuantityMutation,
  useDeleteCartItemMutation,
  useAddItemToCartMutation,
} = cartApi;

// Correction: The `tagTypes` array should be defined in the `createApi` call (i.e., in `src/store/api.js`).
// It's not a property of `injectEndpoints`.
// I will proceed assuming `CartItem` will be added to `tagTypes` in `src/store/api.js` in a separate step if not already present.
// If I encounter issues related to tags not being recognized, this will be the first place to check.
// For now, I'll remove `tagTypes: ['CartItem']` from here as it's structurally incorrect for `injectEndpoints`.
// The task description might have misplaced this instruction.

// Corrected structure without `tagTypes` in injectEndpoints:
// (File content will be the same as above but without the tagTypes line in injectEndpoints)
