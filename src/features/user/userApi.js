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
  // Add new mutations here
  updateUserProfile: builder.mutation({
    query: ({ id, ...userData }) => ({ // userData: { first_name, last_name, email }
      url: `/users/${id}`,
      method: 'PUT',
      body: userData,
    }),
    invalidatesTags: (result, error, { id }) => [{ type: 'User', id: 'ME' }, { type: 'User', id }],
  }),
  changePassword: builder.mutation({
    query: ({ id, ...passwordData }) => ({ // passwordData: { old_password, new_password, confirm_password }
      url: `/users/${id}/password`,
      method: 'PUT',
      body: passwordData, // Send all password fields as per existing axios call
    }),
    // No specific tag invalidation typically needed for password change,
    // unless it affects something like a 'lastPasswordChangeDate' displayed in the UI.
    // If it logs out other sessions or affects current session state directly,
    // specific 'Auth' tags might be considered, but not usually for just a password change.
  }),
});

export const { 
  useGetMeQuery, 
  useLazyGetMeQuery, 
  useUpdateUserProfileMutation, // Export new hook
  useChangePasswordMutation,   // Export new hook
} = userApi;
