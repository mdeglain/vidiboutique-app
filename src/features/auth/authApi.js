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
  }),
});

export const { useLoginMutation, useRequestPasswordResetMutation } = authApi;
