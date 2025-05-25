/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'sonner'
import { API_CONFIG, AUTH_CONFIG } from '@/config/env'
import axiosInstance from '@/api/axios'
import type { InternalAxiosRequestConfig } from 'axios'

const TOKEN_NAME = AUTH_CONFIG.TOKEN_NAME

/**
 * Custom error for API request failures
 */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_NAME)

    if (token) {
      // If headers is a plain object
      if (typeof config.headers === 'object') {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('API ERROR', error.response.data.error.message)
      const message =
        error.response.data?.error.message || 'An error occurred'

      throw new ApiError(message, error.response.status)
    } else if (error.request) {
      toast.error('Network error: Please check your connection')
      throw new ApiError('Network error', 0)
    } else {
      throw new ApiError(error.message, 0)
    }
  }
)

/**
 * API request methods using axiosInstance
 */
export const api = {
  get: <T>(endpoint: string, config = {}) =>
    axiosInstance.get<T>(endpoint, config).then((res) => res.data),

  post: <T>(endpoint: string, data?: any, config = {}) =>
    axiosInstance.post<T>(endpoint, data, config).then((res) => res.data),

  put: <T>(endpoint: string, data?: any, config = {}) =>
    axiosInstance.put<T>(endpoint, data, config).then((res) => res.data),

  delete: <T>(endpoint: string, config = {}) =>
    axiosInstance.delete<T>(endpoint, config).then((res) => res.data),
}
