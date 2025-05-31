import React, { useState } from 'react';
import MenuList from './MenuList';
import MenuForm from './MenuForm';
import { Button, Alert } from '../ui';

/**
 * MenuManagement Component
 * 
 * Main component for managing restaurant menu items.
 * Handles switching between list and form views.
 */
const MenuManagement = () => {
  // State for view mode and selected menu item
  const [viewMode, setViewMode] = useState('list');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Handle edit button click
  const handleEdit = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setViewMode('edit');
  };
  
  // Handle add button click
  const handleAdd = () => {
    setSelectedMenuItem(null);
    setViewMode('add');
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    setSelectedMenuItem(null);
    setViewMode('list');
  };
  
  // Handle save (create or update)
  const handleSave = (menuItem) => {
    setNotification({
      type: 'success',
      message: `Menu item "${menuItem.menu}" ${selectedMenuItem ? 'updated' : 'added'} successfully!`
    });
    setSelectedMenuItem(null);
    setViewMode('list');
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        
        {viewMode === 'list' && (
          <Button
            variant="success"
            onClick={handleAdd}
          >
            Add Menu Item
          </Button>
        )}
      </div>
      
      {notification && (
        <Alert
          type={notification.type}
          dismissible
          onDismiss={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}
      
      {viewMode === 'list' && (
        <MenuList onEdit={handleEdit} />
      )}
      
      {(viewMode === 'add' || viewMode === 'edit') && (
        <MenuForm
          menuItem={selectedMenuItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MenuManagement;
