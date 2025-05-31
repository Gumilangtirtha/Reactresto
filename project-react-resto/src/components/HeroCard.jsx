import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const HeroCard = ({ hero, onSelect, onEdit, onDelete, isAdmin = false }) => {
  const getRoleBadgeVariant = (role) => {
    const roleVariants = {
      'Tank': 'secondary',
      'Fighter': 'danger',
      'Assassin': 'dark',
      'Mage': 'primary',
      'Marksman': 'warning',
      'Support': 'success'
    };
    return roleVariants[role] || 'info';
  };

  const getHeroImage = (heroName) => {
    // Default hero images - in real app, these would come from API
    const heroImages = {
      'Alucard': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      'Miya': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop',
      'Tigreal': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      'Gusion': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop',
      'Eudora': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      'Rafaela': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
    };
    return heroImages[heroName] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop';
  };

  return (
    <Card className="hero-card-enhanced h-100">
      {/* Hero Image Section */}
      <div className="hero-image-container">
        <div className="hero-image-wrapper">
          <Card.Img
            variant="top"
            src={getHeroImage(hero.name)}
            className="hero-image"
            alt={hero.name}
          />
          <div className="hero-image-overlay"></div>
        </div>

        {/* Hero Badges */}
        <div className="hero-badges">
          <Badge className={`role-badge role-${hero.role.toLowerCase()}`}>
            <span className="role-icon">
              {hero.role === 'Tank' && '🛡️'}
              {hero.role === 'Fighter' && '⚔️'}
              {hero.role === 'Assassin' && '🗡️'}
              {hero.role === 'Mage' && '🔮'}
              {hero.role === 'Marksman' && '🏹'}
              {hero.role === 'Support' && '💚'}
            </span>
            {hero.role}
          </Badge>

          {hero.isLegendary && (
            <Badge className="legendary-badge">
              <span className="legendary-icon">⭐</span>
              Legendary
            </Badge>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <Card.Body className="hero-content">
        {/* Hero Header */}
        <div className="hero-header">
          <h5 className="hero-name">{hero.name}</h5>
          <p className="hero-description">{hero.description}</p>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <div className="stat-value">{hero.power || 85}</div>
                <div className="stat-label">Power</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🛡️</div>
              <div className="stat-info">
                <div className="stat-value">{hero.defense || 70}</div>
                <div className="stat-label">Defense</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💨</div>
              <div className="stat-info">
                <div className="stat-value">{hero.speed || 75}</div>
                <div className="stat-label">Speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Skills */}
        <div className="hero-skills-section">
          <div className="skills-header">
            <span className="skills-icon">✨</span>
            <span className="skills-title">Abilities</span>
          </div>
          <div className="skills-container">
            {(hero.skills || ['Basic Attack', 'Ultimate']).map((skill, index) => (
              <div key={index} className="skill-item">
                <span className="skill-dot"></span>
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Actions */}
        <div className="hero-actions">
          <Button
            className="select-hero-btn"
            onClick={() => onSelect && onSelect(hero)}
          >
            <span className="btn-icon">🎮</span>
            <span className="btn-text">Select Hero</span>
          </Button>

          {isAdmin && (
            <div className="admin-actions">
              <Button
                variant="outline-secondary"
                className="admin-btn edit-btn"
                onClick={() => onEdit && onEdit(hero)}
                title="Edit Hero"
              >
                <span className="admin-icon">✏️</span>
              </Button>
              <Button
                variant="outline-danger"
                className="admin-btn delete-btn"
                onClick={() => onDelete && onDelete(hero)}
                title="Delete Hero"
              >
                <span className="admin-icon">🗑️</span>
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default HeroCard;
