/**
 * API Services Index
 * 
 * This file exports all API services from a single entry point,
 * making it easier to import them in components.
 */

import { apiClient, endpoints } from './config';
import menuService from './menuService';
import orderService from './orderService';
import customerService from './customerService';
import categoryService from './categoryService';

// Export all services
export {
  apiClient,
  endpoints,
  menuService,
  orderService,
  customerService,
  categoryService
};

// Export a default object with all services
export default {
  menu: menuService,
  orders: orderService,
  customers: customerService,
  categories: categoryService
};
