/**
 * Error Handler Utility Functions
 * 
 * This module contains utility functions for handling errors.
 */

/**
 * Extract error message from API error response
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Handle axios error responses
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    
    // If the server returned a message, use it
    if (data && data.message) {
      return data.message;
    }
    
    // Otherwise, provide a generic message based on status code
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to access this resource.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else if (error.message) {
    // Something happened in setting up the request
    return error.message;
  }
  
  // For non-axios errors
  return error.toString();
};

/**
 * Log error to console with additional context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(`${timestamp} ${contextPrefix}Error:`, error);
  
  if (error.response) {
    console.error(`${timestamp} ${contextPrefix}Response data:`, error.response.data);
    console.error(`${timestamp} ${contextPrefix}Response status:`, error.response.status);
  }
};

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error object
 */
export const createError = (message, code = 'UNKNOWN_ERROR', details = {}) => {
  return {
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
};

// Export all error handlers as a default object
export default {
  getErrorMessage,
  logError,
  createError
};
