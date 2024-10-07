import axios from 'axios';
import {getToken, destroyToken} from './JwtService';
import { NextResponse } from 'next/server';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

const unAuthorizedApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      destroyToken();
      window.location.href = "/";
      // return NextResponse.redirect(new URL('/login'));
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['Accept'] = 'application/json';
  return config;
});

export { api, unAuthorizedApi };
