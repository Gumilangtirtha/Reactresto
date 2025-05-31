import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const HeroModal = ({ show, onHide, hero, onSave, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Fighter',
    description: '',
    power: 50,
    defense: 50,
    speed: 50,
    skills: '',
    isLegendary: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  useEffect(() => {
    if (hero && isEdit) {
      setFormData({
        name: hero.name || '',
        role: hero.role || 'Fighter',
        description: hero.description || '',
        power: hero.power || 50,
        defense: hero.defense || 50,
        speed: hero.speed || 50,
        skills: Array.isArray(hero.skills) ? hero.skills.join(', ') : (hero.skills || ''),
        isLegendary: hero.isLegendary || false
      });
    } else {
      setFormData({
        name: '',
        role: 'Fighter',
        description: '',
        power: 50,
        defense: 50,
        speed: 50,
        skills: '',
        isLegendary: false
      });
    }
    setErrors({});
  }, [hero, isEdit, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hero name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.power < 1 || formData.power > 100) {
      newErrors.power = 'Power must be between 1 and 100';
    }
    
    if (formData.defense < 1 || formData.defense > 100) {
      newErrors.defense = 'Defense must be between 1 and 100';
    }
    
    if (formData.speed < 1 || formData.speed > 100) {
      newErrors.speed = 'Speed must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const heroData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        id: isEdit ? hero.id : Date.now() // Simple ID generation for demo
      };
      
      await onSave(heroData);
      onHide();
    } catch (error) {
      console.error('Error saving hero:', error);
      setErrors({ submit: 'Failed to save hero. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? '✏️ Edit Hero' : '🎮 Add New Hero'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.submit && (
            <Alert variant="danger">{errors.submit}</Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hero Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter hero name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role *</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the hero's abilities and background"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Power (1-100)</Form.Label>
                <Form.Control
                  type="number"
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  isInvalid={!!errors.power}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.power}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Defense (1-100)</Form.Label>
                <Form.Control
                  type="number"
                  name="defense"
                  value={formData.defense}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  isInvalid={!!errors.defense}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.defense}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Speed (1-100)</Form.Label>
                <Form.Control
                  type="number"
                  name="speed"
                  value={formData.speed}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  isInvalid={!!errors.speed}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.speed}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Skills (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Sword Strike, Ultimate Slash, Shield Block"
            />
            <Form.Text className="text-muted">
              Enter skills separated by commas
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isLegendary"
              checked={formData.isLegendary}
              onChange={handleChange}
              label="⭐ Legendary Hero"
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Hero' : 'Add Hero')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HeroModal;
