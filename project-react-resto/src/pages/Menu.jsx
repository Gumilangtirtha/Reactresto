import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { menuCategories, menuItems, getMenuByCategory, formatPrice } from '../data/menuData';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchTerm, sortBy]);

  const filterItems = () => {
    let items = selectedCategory === 'all' ? menuItems : getMenuByCategory(parseInt(selectedCategory));

    // Filter by search term
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    items.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.isPopular - a.isPopular;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredItems(items);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="menu-page">
      {/* Hero Section */}
      <div className="menu-hero">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Culinary <span className="text-gradient">Excellence</span>
                </h1>
                <p className="hero-subtitle">
                  Discover our carefully crafted menu featuring the finest ingredients
                  and innovative culinary techniques from around the world.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">35+</span>
                    <span className="stat-label">Menu Items</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Categories</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">Avg Rating</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
                  alt="Fine dining"
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search and Filter Section */}
        <Row className="mb-5">
          <Col lg={8}>
            <InputGroup className="search-bar">
              <Form.Control
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button variant="outline-primary" className="search-btn">
                🔍
              </Button>
            </InputGroup>
          </Col>
          <Col lg={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Category Filter */}
        <Row className="mb-5">
          <Col>
            <div className="category-filter">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <span className="category-icon">🍽️</span>
                <span className="category-name">All Menu</span>
              </button>
              {menuCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Menu Items Grid */}
        <Row>
          {filteredItems.map(item => (
            <Col lg={4} md={6} key={item.id} className="mb-4">
              <Card className="menu-card h-100" onClick={() => handleItemClick(item)}>
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-card-badges">
                    {item.isNew && <Badge bg="success" className="badge-new">New</Badge>}
                    {item.isPopular && <Badge bg="warning" className="badge-popular">Popular</Badge>}
                  </div>
                  <div className="menu-card-overlay">
                    <Button
                      variant="light"
                      className="btn-view-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="menu-card-body">
                  <div className="menu-card-header">
                    <h5 className="menu-card-title">{item.name}</h5>
                    <div className="menu-card-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{item.rating}</span>
                    </div>
                  </div>
                  <p className="menu-card-description">{item.description}</p>
                  <div className="menu-card-footer">
                    <div className="menu-card-price">{formatPrice(item.price)}</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="menu-card-meta">
                    <span className="prep-time">⏱️ {item.preparationTime}</span>
                    <span className="calories">🔥 {item.calories} cal</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredItems.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <div className="no-results">
                <h3>No menu items found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <Button variant="primary" className="cart-toggle">
            🛒 {getCartItemCount()} items - {formatPrice(getCartTotal())}
          </Button>
        </div>
      )}

      {/* Item Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedItem && (
          <>
            <Modal.Header closeButton className="modal-header-custom">
              <Modal.Title>{selectedItem.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              <Row>
                <Col md={6}>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="img-fluid rounded-3 mb-3"
                  />
                </Col>
                <Col md={6}>
                  <div className="item-details">
                    <div className="item-badges mb-3">
                      {selectedItem.isNew && <Badge bg="success" className="me-2">New</Badge>}
                      {selectedItem.isPopular && <Badge bg="warning" className="me-2">Popular</Badge>}
                      <Badge bg="info">{selectedItem.category}</Badge>
                    </div>

                    <p className="item-description">{selectedItem.description}</p>

                    <div className="item-meta mb-3">
                      <div className="meta-item">
                        <strong>Rating:</strong> ⭐ {selectedItem.rating}/5
                      </div>
                      <div className="meta-item">
                        <strong>Prep Time:</strong> ⏱️ {selectedItem.preparationTime}
                      </div>
                      <div className="meta-item">
                        <strong>Calories:</strong> 🔥 {selectedItem.calories}
                      </div>
                    </div>

                    <div className="item-ingredients mb-3">
                      <strong>Ingredients:</strong>
                      <div className="ingredients-list">
                        {selectedItem.ingredients.map((ingredient, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedItem.allergens.length > 0 && (
                      <div className="item-allergens mb-3">
                        <strong>Allergens:</strong>
                        <div className="allergens-list">
                          {selectedItem.allergens.map((allergen, index) => (
                            <Badge key={index} bg="danger" className="me-1 mb-1">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="item-price-section">
                      <div className="item-price">{formatPrice(selectedItem.price)}</div>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          addToCart(selectedItem);
                          setShowModal(false);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Menu;
