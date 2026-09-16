'use client';
import axios from 'axios';
import { signOut } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: '/api/proxy'
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/auth/login' });
    }
    throw error;
  }
);

export default axiosInstance;
