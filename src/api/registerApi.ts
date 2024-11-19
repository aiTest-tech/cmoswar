// src/features/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginType } from '../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.10.2.179:8000/api/auth/' }),
  endpoints: (builder) => ({
    login: builder.mutation<{ access: string; refresh: string }, LoginType>({
      query: (credentials) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
