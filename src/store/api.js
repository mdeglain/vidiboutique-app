import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authRefresh, disconnect } from '@/features/auth/auth.slice'; // Import actions
// import { Mutex } from 'async-mutex'; // Optional: for preventing multiple refresh calls simultaneously

const baseUrl = window.location.href.includes('localhost')
  ? 'http://127.0.0.1:5000/'
  : 'https://vidiboutique-api.onrender.com/';

// Optional: Mutex to ensure only one token refresh attempt occurs at a time
// const mutex = new Mutex();

const baseQueryInstance = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Optional: wait until the mutex is available without locking it
  // await mutex.waitForUnlock();
  let result = await baseQueryInstance(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Optional: Lock the mutex to prevent other 401s from triggering simultaneous refresh
    // if (!mutex.isLocked()) {
    //   const release = await mutex.acquire();
    try {
      const refreshToken = api.getState().auth.refreshToken;
      if (refreshToken) {
        // Attempt to refresh the token
        const refreshResult = await baseQueryInstance(
          {
            url: '/auth/refresh', // Your refresh token endpoint
            method: 'POST',
            // Body might be null or might need { refresh_token: refreshToken } depending on API
            // Headers for refresh might be different, e.g., some APIs expect refresh token in body
            // For this specific app, the existing axios logic used Bearer token for refresh:
            // headers: { Authorization: `Bearer ${refreshToken}` }
            // This is unusual. Most expect it in body. Assuming POST with no body and relying on prepareHeaders for refresh token.
            // If refresh requires its own specific header, this call needs custom headers.
            // Let's assume the refresh endpoint is special and doesn't need Auth header or needs refresh token.
            // The existing axiosInstance set Authorization: Bearer ${refreshToken} for the /auth/refresh call.
            // fetchBaseQuery's prepareHeaders would set the *access* token. This is a conflict.
            // So, for the refresh call, we might need a custom fetch or a baseQuery without prepareHeaders.
            // For simplicity, let's assume '/auth/refresh' doesn't need the access token header,
            // and the backend can pick up the refresh token from a cookie or specific header if not in body.
            // A more robust way:
            // const refreshFetch = fetchBaseQuery({ baseUrl: baseUrl }); // No prepareHeaders
            // const refreshResult = await refreshFetch({ url: '/auth/refresh', method: 'POST', body: { refreshToken } }, api, extraOptions);
            // For now, assume existing baseQueryInstance is fine, but this is a common pitfall.
            // The provided axios code does:
            // axios.post(`${url}auth/refresh`, null, { headers: { Authorization: `Bearer ${refreshToken}` } });
            // This means we need a way to set a *different* Authorization header for this specific call.
            // A separate fetchBaseQuery instance for refresh is cleaner:
             const refreshBaseQuery = fetchBaseQuery({ baseUrl: baseUrl });
             const refreshResponse = await refreshBaseQuery(
               { url: '/auth/refresh', method: 'POST', headers: { 'Authorization': `Bearer ${refreshToken}` } },
               api,
               extraOptions
             );

        if (refreshResponse.data && refreshResponse.data.access_token && refreshResponse.data.refresh_token) {
          // Store the new tokens
          api.dispatch(authRefresh({ access_token: refreshResponse.data.access_token, refresh_token: refreshResponse.data.refresh_token }));
          // Retry the original request with the new token
          result = await baseQueryInstance(args, api, extraOptions);
        } else {
          // Refresh failed, logout the user
          api.dispatch(disconnect()); // Dispatch your logout action
          // Optionally, redirect to login page or show a global error
        }
      } else {
        // No refresh token available, logout
        api.dispatch(disconnect());
      }
    } catch (e) {
      // Catch any error during the refresh attempt and ensure logout
      api.dispatch(disconnect());
    } finally {
      // Optional: release the mutex
      // release();
    }
    // } else {
    //   // Optional: was already refreshing, wait for the new token
    //   await mutex.waitForUnlock();
    //   result = await baseQueryInstance(args, api, extraOptions);
    // }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth, // Use the wrapped baseQuery
  endpoints: (builder) => ({}),
  tagTypes: ['Auth', 'Product', 'Order', 'AdminOrder', 'Address', 'DefaultOrder', 'CartItem', 'FavoriteProduct', 'Category', 'User'],
});
