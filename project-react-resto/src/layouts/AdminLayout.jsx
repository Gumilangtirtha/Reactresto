import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

/**
 * Layout untuk halaman admin
 * Menyediakan sidebar navigasi dan area konten utama
 */
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // Menu items untuk admin dengan prefix /admin
  const adminMenuItems = [
    { path: '.', label: 'Dashboard', icon: '🏠' },
    { path: 'kategori', label: 'Heroes', icon: '⚔️' },
    { path: 'menu', label: 'Skills', icon: '🔥' },
    { path: 'pelanggan', label: 'Players', icon: '👤' },
    { path: 'order', label: 'Battles', icon: '⚡' },
    { path: 'order-detail', label: 'Battle Stats', icon: '📊' },
    // Only show Users menu for admin
    ...(isAdmin() ? [{ path: 'users', label: 'Users', icon: '👥' }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                  <span className="text-primary-light hero-glow">⚔️ ML</span>
                  <span className="text-secondary hero-glow">Admin ⚔️</span>
                </Link>
              </h3>

              <div className="nav-container">
                <div className="nav-header">
                  🎮 Admin Panel 🎮
                </div>
                <div className="nav-body">
                  <ul className="nav flex-column">
                    {adminMenuItems.map((item) => (
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

              {/* User Info */}
              <div className="mt-4 p-3 bg-light rounded">
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

              <div className="mt-3 text-center">
                <Link to="/" className="btn-custom btn-secondary-custom btn-sm">
                  <i className="fas fa-home me-1"></i> Back to Game
                </Link>
              </div>
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

export default AdminLayout;
