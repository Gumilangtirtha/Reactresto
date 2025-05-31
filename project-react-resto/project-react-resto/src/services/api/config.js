/**
 * API Configuration Module
 * 
 * This module contains the base configuration for API requests,
 * including the base URL, headers, and axios instance setup.
 */

import axios from 'axios';

// Base API URL - change this to your actual API endpoint
export const API_BASE_URL = 'http://localhost/project-react-resto/api';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
  config => {
    // You can add authentication token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle different error statuses
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('API Error Response:', error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - handle authentication error
          console.error('Authentication error');
          break;
        case 403:
          // Forbidden - handle permission error
          console.error('Permission denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          // Other errors
          console.error(`Error with status code: ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export endpoints for different resources
export const endpoints = {
  menu: '/menu',
  categories: '/categories',
  orders: '/orders',
  customers: '/customers',
  // Add more endpoints as needed
};

export default apiClient;
