/**
 * Environment configuration for the application
 *
 * These values can be overridden by setting environment variables
 * in production environments
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  SOCKET_PATH:
    import.meta.env.VITE_API_SOCKET_PATH || 'http://localhost:3000',
}

// Auth configuration
export const AUTH_CONFIG = {
  // Name used for storing the auth token in localStorage
  TOKEN_NAME: 'authToken',
}

// App configuration
export const APP_CONFIG = {
  // App name used in various places
  APP_NAME: 'Social4Sports',
}
