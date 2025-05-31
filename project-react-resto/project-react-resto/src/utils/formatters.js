/**
 * Formatter Utility Functions
 * 
 * This module contains utility functions for formatting data.
 */

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Format date
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
};

/**
 * Format a date string into a localized date string
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
export const formatDateString = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format time
 * @param {string|Date} date - The date/time to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted time string
 */
export const formatTime = (date, locale = 'en-US') => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Format phone number
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  // Basic formatting for US phone numbers
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phoneNumber;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

// Export all formatters as a default object
export default {
  formatCurrency,
  formatDate,
  formatDateString,
  formatTime,
  formatPhoneNumber,
  truncateText
};
