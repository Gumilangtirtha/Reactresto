import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Alert, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getPopularItems, formatPrice } from '../data/menuData';
import '../styles/Home.css';

const Home = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const popularItems = getPopularItems().slice(0, 3); // Get top 3 popular items

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Welcome to <span className="text-gradient">Mobile Legends</span> Hero Management
                </h1>
                <p className="hero-subtitle">
                  Master the battlefield with legendary heroes and epic skills.
                  Where every battle is a legend in the making.
                </p>

                {/* Authentication Status */}
                {isAuthenticated ? (
                  <Alert variant="success" className="glass-alert mb-4">
                    <strong>Welcome back, {user?.name}!</strong>
                    <br />
                    You are logged in as: <span className="badge bg-primary ms-1">{user?.role}</span>
                    {isAdmin() && (
                      <div className="mt-2">
                        <Link to="/admin" className="btn btn-sm btn-outline-light">
                          Access Admin Panel
                        </Link>
                      </div>
                    )}
                  </Alert>
                ) : (
                  <Alert variant="info" className="glass-alert mb-4">
                    <strong>Welcome!</strong>
                    <br />
                    Please <Link to="/login" className="text-white">login</Link> to access full features or <Link to="/register" className="text-white">register</Link> if you don't have an account.
                  </Alert>
                )}

                <div className="hero-actions">
                  <Link to="/menu" className="btn btn-primary btn-lg me-3">
                    View Heroes
                  </Link>
                  <Button variant="outline-light" size="lg">
                    Start Battle
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=500&fit=crop"
                  alt="Mobile Legends Gaming Experience"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Popular Menu Section */}
      <div className="popular-menu-section">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title text-white">Popular Heroes</h2>
              <p className="section-subtitle text-white">Master these legendary champions</p>
            </Col>
          </Row>

          <Row>
            {popularItems.map(item => (
              <Col lg={4} md={6} key={item.id} className="mb-4">
                <Card className="popular-menu-card">
                  <div className="menu-image-container">
                    <img src={item.image} alt={item.name} className="menu-image" />
                    <div className="menu-badge">Legendary</div>
                  </div>
                  <Card.Body>
                    <div className="menu-header">
                      <h5 className="menu-title">{item.name}</h5>
                      <div className="menu-rating">
                        <span className="rating-stars">⭐</span>
                        <span className="rating-value">{item.rating}</span>
                      </div>
                    </div>
                    <p className="menu-description">{item.description}</p>
                    <div className="menu-footer">
                      <div className="menu-price">{formatPrice(item.price)}</div>
                      <Button variant="primary" size="sm">
                        Select Hero
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col className="text-center mt-4">
              <Link to="/menu" className="btn btn-outline-light btn-lg">
                View All Heroes
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-5">
        <Row>
          <Col md={3} className="text-center mb-4">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Players</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-card">
              <div className="stat-number">120+</div>
              <div className="stat-label">Heroes Available</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-card">
              <div className="stat-number">6</div>
              <div className="stat-label">Hero Roles</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-card">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Game Rating</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
