/**
 * Order API Service Module
 * 
 * This module contains all API operations related to restaurant orders.
 * Each function is focused on a specific API operation (GET, POST, PUT, DELETE).
 */

import { apiClient, endpoints } from './config';

/**
 * Get all orders
 * @returns {Promise} Promise object with orders data
 */
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get(`${endpoints.orders}.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 * @param {number} id - Order ID
 * @returns {Promise} Promise object with order data
 */
export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`${endpoints.orders}.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise} Promise object with created order data
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(`${endpoints.orders}.php`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 * @param {number} id - Order ID
 * @param {Object} orderData - Updated order data
 * @returns {Promise} Promise object with updated order data
 */
export const updateOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`${endpoints.orders}.php`, {
      id,
      ...orderData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an order
 * @param {number} id - Order ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteOrder = async (id) => {
  try {
    const response = await apiClient.delete(`${endpoints.orders}.php`, {
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get orders by customer
 * @param {number} customerId - Customer ID
 * @returns {Promise} Promise object with orders data
 */
export const getOrdersByCustomer = async (customerId) => {
  try {
    const response = await apiClient.get(`${endpoints.orders}.php?customer=${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Update order status
 * @param {number} id - Order ID
 * @param {string} status - New order status
 * @returns {Promise} Promise object with updated order data
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`${endpoints.orders}.php`, {
      id,
      status
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    throw error;
  }
};

// Export all functions as a service object
export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  updateOrderStatus
};
