import { apiSlice } from '../../store/api';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me', // Endpoint to get current user details
      providesTags: (result, error, id) => [{ type: 'User', id: 'ME' }], // Use a specific ID like 'ME' for the current user
    }),
    // Example for other user-related endpoints if needed in the future
    // updateUserProfile: builder.mutation({
    //   query: (profileData) => ({
    //     url: '/users/me',
    //     method: 'PUT',
    //     body: profileData,
    //   }),
    //   invalidatesTags: [{ type: 'User', id: 'ME' }],
    // }),
  }),
  // As per RTK Query docs, tagTypes should be defined in the root createApi call.
  // This will be handled in Part 2 by adding 'User' to src/store/api.js.
});

export const { 
  useGetMeQuery, 
  useLazyGetMeQuery, 
  // useUpdateUserProfileMutation // Example
} = userApi;
