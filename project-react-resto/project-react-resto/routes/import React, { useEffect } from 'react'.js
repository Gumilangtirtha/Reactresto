import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from './AdminNavbar';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        {/* Admin content */}
      </div>
    </>
  );
};

export default Admin;
