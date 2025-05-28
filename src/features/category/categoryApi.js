import { apiSlice } from '../../store/api';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: (result) =>
        result && result.data // Assuming the actual category items are in result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
  }),
  // Note: `tagTypes` should be in the main apiSlice definition.
  // This will be addressed in Part 2 by adding 'Category' to src/store/api.js
});

export const { useGetCategoriesQuery } = categoryApi;
