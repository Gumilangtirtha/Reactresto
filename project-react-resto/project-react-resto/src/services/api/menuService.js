/**
 * Menu API Service Module
 * 
 * This module contains all API operations related to restaurant menu items.
 * Each function is focused on a specific API operation (GET, POST, PUT, DELETE).
 */

import { apiClient, endpoints } from './config';

/**
 * Get all menu items
 * @returns {Promise} Promise object with menu items data
 */
export const getAllMenuItems = async () => {
  try {
    const response = await apiClient.get(`${endpoints.menu}.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Get a single menu item by ID
 * @param {number} id - Menu item ID
 * @returns {Promise} Promise object with menu item data
 */
export const getMenuItemById = async (id) => {
  try {
    const response = await apiClient.get(`${endpoints.menu}.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new menu item
 * @param {Object} menuData - Menu item data
 * @returns {Promise} Promise object with created menu item data
 */
export const createMenuItem = async (menuData) => {
  try {
    const response = await apiClient.post(`${endpoints.menu}.php`, menuData);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

/**
 * Update an existing menu item
 * @param {number} id - Menu item ID
 * @param {Object} menuData - Updated menu item data
 * @returns {Promise} Promise object with updated menu item data
 */
export const updateMenuItem = async (id, menuData) => {
  try {
    const response = await apiClient.put(`${endpoints.menu}.php`, {
      id,
      ...menuData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {number} id - Menu item ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteMenuItem = async (id) => {
  try {
    const response = await apiClient.delete(`${endpoints.menu}.php`, {
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get menu items by category
 * @param {number} categoryId - Category ID
 * @returns {Promise} Promise object with menu items data
 */
export const getMenuItemsByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`${endpoints.menu}.php?category=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu items for category ${categoryId}:`, error);
    throw error;
  }
};

// Export all functions as a service object
export default {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory
};
