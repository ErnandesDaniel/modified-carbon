'use client';

import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { isNil } from 'lodash-es';

import axiosInstance from '@/api/rest-client/axiosInstance';

export const restApiAxiosClient = async <T>(config: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance(config);
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error) && !isNil(error.response)) {
      const contentType = error.response.headers['content-type'];

      let { data } = error.response;

      if ((data instanceof ArrayBuffer || ArrayBuffer.isView(data)) && contentType?.includes('application/json')) {
        const textDecoder = new TextDecoder();
        data = JSON.parse(textDecoder.decode(data));
      }
      error.response.data = data;
    }

    throw error;
  }
};
