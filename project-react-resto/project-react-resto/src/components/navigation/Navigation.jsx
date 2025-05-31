import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Card } from 'react-bootstrap';
import './Navigation.css';

/**
 * Navigation component for the restaurant management application
 * Displays a vertical navigation menu with links to different sections
 */
const Navigation = () => {
  return (
    <Card className="nav-container">
      <Card.Header className="nav-header">
        Menu Aplikasi
      </Card.Header>
      <Card.Body className="p-0">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link as={Link} to="/kategori" className="nav-link">
              Kategori
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/menu" className="nav-link">
              Menu
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/pelanggan" className="nav-link">
              Pelanggan
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/order" className="nav-link">
              Order
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/order-detail" className="nav-link">
              Order Detail
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin" className="nav-link">
              Admin
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default Navigation;
