// lib/api.ts - Simplified Version
"use client";

import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Use existing refresh promise if one is in progress
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        window.location.replace("/");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = getCookie("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE}/auth/refresh`,
      { refreshToken },
    );

    const { accessToken, refreshToken: newRefreshToken } =
      response.data?.data || response.data;

    setCookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 5,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    if (newRefreshToken) {
      setCookie("refreshToken", newRefreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return accessToken;
  } catch (error) {
    throw error;
  }
}

export default api;
