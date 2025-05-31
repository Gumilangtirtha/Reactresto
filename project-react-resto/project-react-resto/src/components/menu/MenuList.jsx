import React, { useState, useEffect } from 'react';
import { menuService, categoryService } from '../../services/api';
import { Table, Button, Alert, Card, ConfirmationModal } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errorHandler';

/**
 * MenuList Component
 * 
 * Displays a list of menu items with options to view, edit, and delete.
 */
const MenuList = ({ onEdit }) => {
  // State for menu items and loading status
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Fetch menu items and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch menu items and categories in parallel
        const [menuResponse, categoriesResponse] = await Promise.all([
          menuService.getAllMenuItems(),
          categoryService.getAllCategories()
        ]);
        
        if (menuResponse.success) {
          setMenuItems(menuResponse.data);
        } else {
          setError(menuResponse.message || 'Failed to fetch menu items');
        }
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  // Handle delete button click
  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };
  
  // Confirm deletion
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setLoading(true);
      const response = await menuService.deleteMenuItem(itemToDelete.id);
      
      if (response.success) {
        // Remove the deleted item from the state
        setMenuItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      } else {
        setError(response.message || 'Failed to delete menu item');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setItemToDelete(null);
    }
  };
  
  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%'
    },
    {
      title: 'Image',
      dataIndex: 'gambar',
      width: '10%',
      render: (_, record) => (
        record.gambar ? (
          <img 
            src={record.gambar} 
            alt={record.menu} 
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )
      )
    },
    {
      title: 'Menu',
      dataIndex: 'menu',
      width: '20%'
    },
    {
      title: 'Description',
      dataIndex: 'deskripsi',
      width: '30%',
      render: (text) => (
        <div className="truncate max-w-xs" title={text}>
          {text}
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'kategori_id',
      width: '15%',
      render: (categoryId) => getCategoryName(categoryId)
    },
    {
      title: 'Price',
      dataIndex: 'harga',
      width: '10%',
      render: (price) => formatCurrency(price)
    },
    {
      title: 'Actions',
      width: '10%',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <>
      <Card title="Menu Items">
        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Table
          columns={columns}
          data={menuItems}
          loading={loading}
          emptyMessage="No menu items found. Add some items to get started."
        />
      </Card>
      
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemToDelete?.menu}"? This action cannot be undone.`}
      />
    </>
  );
};

export default MenuList;
