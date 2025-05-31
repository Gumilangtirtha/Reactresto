import React from 'react';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

const HeroFilter = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  sortBy,
  setSortBy,
  onReset
}) => {
  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'power', label: 'Power' },
    { value: 'defense', label: 'Defense' },
    { value: 'speed', label: 'Speed' },
    { value: 'role', label: 'Role' }
  ];

  return (
    <div className="hero-filter-wrapper">
      <div className="filter-header">
        <h5 className="filter-title">
          <span className="filter-icon">🎯</span>
          Hero Filters & Search
        </h5>
        <p className="filter-subtitle">Find your perfect champion</p>
      </div>

      <div className="filter-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <div className="search-icon">🔍</div>
            <Form.Control
              type="text"
              placeholder="Search heroes by name, skills, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <Button
                variant="link"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Role Filter Section */}
        <div className="role-filter-section">
          <div className="filter-label">
            <span className="label-icon">⚔️</span>
            <span className="label-text">Hero Roles</span>
          </div>
          <div className="role-buttons-container">
            {roles.map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? 'primary' : 'outline-primary'}
                className={`role-btn ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                <span className="role-icon">
                  {role === 'All' && '🌟'}
                  {role === 'Tank' && '🛡️'}
                  {role === 'Fighter' && '⚔️'}
                  {role === 'Assassin' && '🗡️'}
                  {role === 'Mage' && '🔮'}
                  {role === 'Marksman' && '🏹'}
                  {role === 'Support' && '💚'}
                </span>
                <span className="role-text">{role}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sort and Actions Section */}
        <div className="sort-actions-section">
          <div className="sort-container">
            <div className="filter-label">
              <span className="label-icon">📊</span>
              <span className="label-text">Sort By</span>
            </div>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="actions-container">
            <Button
              variant="outline-secondary"
              className="reset-btn"
              onClick={onReset}
            >
              <span className="btn-icon">🔄</span>
              Reset All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFilter;
