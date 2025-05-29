import { apiSlice } from '../../store/api';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // invalidatesTags: ['Auth'], // Keep or remove based on whether other 'Auth' tagged queries need refetching after login.
      // For now, let's assume direct data handling in the component is sufficient.
    }),
    requestPasswordReset: builder.mutation({
      query: ({ email }) => ({
        url: '/users/reset-password',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyPasswordResetToken: builder.query({
      query: (token) => `/users/reset-password/${token}`,
    }),
    confirmPasswordReset: builder.mutation({
      query: (payload) => ({ 
        url: '/users/reset-password',
        method: 'PUT',
        // Backend expects: { "public_id": user.public_id, "new_password": password.new_password, "confirm_password": password.confirm_password }
        // The confirm_password is for backend validation, so it should be included if API expects it.
        // The existing axios call sends new_password and confirm_password.
        body: { public_id: payload.public_id, new_password: payload.new_password, confirm_password: payload.confirm_password },
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRequestPasswordResetMutation,
  useLazyVerifyPasswordResetTokenQuery, // Export new hook
  useConfirmPasswordResetMutation,   // Export new hook
} = authApi;
