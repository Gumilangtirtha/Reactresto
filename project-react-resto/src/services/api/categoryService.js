/**
 * Category API Service Module
 * 
 * This module contains all API operations related to menu categories.
 * Each function is focused on a specific API operation (GET, POST, PUT, DELETE).
 */

import { apiClient, endpoints } from './config';

/**
 * Get all categories
 * @returns {Promise} Promise object with categories data
 */
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(`${endpoints.categories}.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get a single category by ID
 * @param {number} id - Category ID
 * @returns {Promise} Promise object with category data
 */
export const getCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`${endpoints.categories}.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise} Promise object with created category data
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post(`${endpoints.categories}.php`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update an existing category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} Promise object with updated category data
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await apiClient.put(`${endpoints.categories}.php`, {
      id,
      ...categoryData
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`${endpoints.categories}.php`, {
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};

// Export all functions as a service object
export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
