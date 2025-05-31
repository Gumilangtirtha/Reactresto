import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for handling delete operations
 * @param {string} url - Base URL for the delete endpoint
 * @param {Function} onSuccess - Callback function to be called after successful deletion
 * @returns {Object} Object containing delete function and state variables
 */
const useDelete = (url, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const resetState = () => {
    setError(null);
    setMessage(null);
  };

  const deleteItem = async (id) => {
    // Show confirmation dialog
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      setLoading(true);
      resetState();

      const response = await axios.delete(`${url}/${id}`);
      
      // Assume the API returns a success message
      setMessage(response.data.message || 'Data berhasil dihapus');
      
      // Call the success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Terjadi kesalahan saat menghapus data'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteItem,
    loading,
    error,
    message,
    resetState
  };
};

export default useDelete;
