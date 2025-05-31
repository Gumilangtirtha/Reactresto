import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register, loading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nama lengkap harus diisi');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username harus diisi');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username minimal 3 karakter');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    if (!formData.password) {
      setError('Password harus diisi');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const result = await register(dataToSend);

      if (result.success) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Registrasi gagal');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="h4 text-gray-900 mb-4">🎮 Join the Arena 🎮</h2>
                <p className="text-muted">Create your Mobile Legends account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Player Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your player name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose your username"
                    required
                  />
                  <Form.Text className="text-muted">
                    Minimal 3 karakter, hanya huruf, angka, dan underscore
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                  />
                  <Form.Text className="text-muted">
                    Minimal 6 karakter
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    '⚔️ Join Arena'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  New accounts will have Player role by default
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;