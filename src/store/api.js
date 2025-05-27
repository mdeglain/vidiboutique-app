import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = window.location.href.includes('localhost')
  ? 'http://127.0.0.1:5000/'
  : 'https://vidiboutique-api.onrender.com/';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({}),
  tagTypes: ['Auth', 'Product', 'Order', 'AdminOrder', 'Address', 'DefaultOrder'],
});
