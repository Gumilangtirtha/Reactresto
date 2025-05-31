import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import NotFoundPage from './pages/NotFoundPage';
import Home from './pages/Home';
import KategoriPage from './pages/KategoriPage';
import MenuPage from './pages/MenuPage';
import PelangganPage from './pages/PelangganPage';
import OrderPage from './pages/OrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/MobileLegends.css';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import KategoriAdmin from './pages/admin/KategoriAdmin';
import MenuAdmin from './pages/admin/MenuAdmin';
import PelangganAdmin from './pages/admin/PelangganAdmin';
import OrderAdmin from './pages/admin/OrderAdmin';
import OrderDetailAdmin from './pages/admin/OrderDetailAdmin';
import UserAdmin from './pages/admin/UserAdmin';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


/**
 * Main App Component
 *
 * Provides authentication context and sets up routing for the application
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

/**
 * AppRoutes Component
 *
 * Sets up all application routes with proper authentication checks
 */
const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="kategori" element={<KategoriPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="pelanggan" element={<PelangganPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="order-detail" element={<OrderDetailPage />} />
        </Route>

        {/* Admin Routes - All prefixed with /admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="kategori" element={<KategoriAdmin />} />
          <Route path="menu" element={<MenuAdmin />} />
          <Route path="pelanggan" element={<PelangganAdmin />} />
          <Route path="order" element={<OrderAdmin />} />
          <Route path="order-detail" element={<OrderDetailAdmin />} />
          <Route path="users" element={<UserAdmin />} />
        </Route>



        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <h2 className="mt-4">Loading...</h2>
        <p>Preparing your restaurant dashboard</p>
      </div>
    </div>
  );
};

// Page Transition Component
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};

export default App;
