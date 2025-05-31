/**
 * Customer API Service Module
 * 
 * This module contains all API operations related to restaurant customers.
 * Each function is focused on a specific API operation (GET, POST, PUT, DELETE).
 */

import { apiClient, endpoints } from './config';

/**
 * Get all customers
 * @returns {Promise} Promise object with customers data
 */
export const getAllCustomers = async () => {
  try {
    const response = await apiClient.get(`${endpoints.customers}.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Get a single customer by ID
 * @param {number} id - Customer ID
 * @returns {Promise} Promise object with customer data
 */
export const getCustomerById = async (id) => {
  try {
    const response = await apiClient.get(`${endpoints.customers}.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise} Promise object with created customer data
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post(`${endpoints.customers}.php`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Update an existing customer
 * @param {number} id - Customer ID
 * @param {Object} customerData - Updated customer data
 * @returns {Promise} Promise object with updated customer data
 */
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await apiClient.put(`${endpoints.customers}.php`, {
      id,
      ...customerData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a customer
 * @param {number} id - Customer ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteCustomer = async (id) => {
  try {
    const response = await apiClient.delete(`${endpoints.customers}.php`, {
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search customers by name
 * @param {string} query - Search query
 * @returns {Promise} Promise object with matching customers data
 */
export const searchCustomers = async (query) => {
  try {
    const response = await apiClient.get(`${endpoints.customers}.php?search=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching customers with query "${query}":`, error);
    throw error;
  }
};

// Export all functions as a service object
export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
};
