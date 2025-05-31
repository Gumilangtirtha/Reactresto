/**
 * Validator Utility Functions
 * 
 * This module contains utility functions for validating data.
 */

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is empty
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic validation for phone numbers
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate price (positive number)
 * @param {number|string} price - The price to validate
 * @returns {boolean} True if the price is valid
 */
export const isValidPrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

/**
 * Validate required fields in an object
 * @param {Object} data - The data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Object with isValid flag and errors object
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (isEmpty(data[field])) {
      errors[field] = `${field} is required`;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Validate form data with custom validation rules
 * @param {Object} data - The data object to validate
 * @param {Object} validationRules - Object with field names and validation functions
 * @returns {Object} Object with isValid flag and errors object
 */
export const validateForm = (data, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const value = data[field];
    const validate = validationRules[field];
    
    const fieldErrors = validate(value, data);
    if (fieldErrors) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Export all validators as a default object
export default {
  isEmpty,
  isValidEmail,
  isValidPhone,
  isValidPrice,
  validateRequired,
  validateForm
};
