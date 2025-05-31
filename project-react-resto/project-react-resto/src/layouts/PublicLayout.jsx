import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

/**
 * Layout untuk halaman publik
 * Menyediakan sidebar navigasi dan area konten utama
 */
const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  // Menu items untuk pengguna publik (tanpa prefix /admin)
  const publicMenuItems = [
    { path: '.', label: 'Home', icon: '🏠' },
    { path: 'kategori', label: 'Kategori', icon: '📊' },
    { path: 'menu', label: 'Menu', icon: '🍽️' },
    { path: 'pelanggan', label: 'Pelanggan', icon: '👥' },
    { path: 'order', label: 'Order', icon: '📝' },
    { path: 'order-detail', label: 'Order Detail', icon: '📋' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="App">
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="sidebar">
            <div className="sidebar-sticky">
              <h3 className="mt-3 mb-4 text-center">
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <span className="text-primary-light">Resto</span>
                  <span className="text-secondary">Nav</span>
                </Link>
              </h3>

              <div className="nav-container">
                <div className="nav-header">
                  Menu Aplikasi
                </div>
                <div className="nav-body">
                  <ul className="nav flex-column">
                    {publicMenuItems.map((item) => (
                      <li className="nav-item" key={item.path}>
                        <Link
                          to={item.path}
                          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          <span className="nav-label">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* User Authentication Section */}
              {isAuthenticated ? (
                <div className="mt-4">
                  {/* User Info */}
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">👤</span>
                      <div>
                        <div className="fw-bold">{user?.name}</div>
                        <small className="text-muted">{user?.role}</small>
                      </div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>

                  {/* Admin Panel Link - Only for Admin */}
                  {isAdmin() && (
                    <div className="text-center mb-3">
                      <Link to="/admin" className="btn-custom btn-secondary-custom btn-sm">
                        <i className="fas fa-cog me-1"></i> Admin Panel
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <div className="text-center mb-3">
                    <Link to="/login" className="btn-custom btn-outline-primary btn-sm me-2">
                      <i className="fas fa-sign-in-alt me-1"></i> Login
                    </Link>
                    <Link to="/register" className="btn-custom btn-outline-success btn-sm">
                      <i className="fas fa-user-plus me-1"></i> Daftar
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="main-content">
            <Outlet /> {/* Ini akan menampilkan komponen rute anak */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PublicLayout;
