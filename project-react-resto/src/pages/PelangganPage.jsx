import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Modal, Form } from 'react-bootstrap';
import PlayerStats from '../components/PlayerStats';
import { getPlayers, addPlayer, getBattlesByPlayer, getTopPlayers } from '../data/battleData';

const PelangganPage = () => {
  const [players, setPlayers] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    favoriteRole: 'Fighter'
  });

  const roles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const playersData = getPlayers();
      const topPlayersData = getTopPlayers();
      setPlayers(playersData);
      setTopPlayers(topPlayersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading players:', error);
      showAlert('Error loading players', 'danger');
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleAddPlayer = () => {
    setFormData({ name: '', email: '', phone: '', favoriteRole: 'Fighter' });
    setShowModal(true);
  };

  const handleSavePlayer = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert('Player name is required', 'danger');
      return;
    }

    try {
      addPlayer(formData);
      loadData();
      setShowModal(false);
      showAlert(`Player ${formData.name} added successfully!`, 'success');
    } catch (error) {
      console.error('Error adding player:', error);
      showAlert('Error adding player', 'danger');
    }
  };

  const handleShowStats = (player) => {
    setSelectedPlayer(player);
    setShowStatsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePlayerStats = (player) => {
    const battles = getBattlesByPlayer(player.id);
    const winRate = player.battles > 0 ? ((player.wins / player.battles) * 100).toFixed(1) : 0;
    return { ...player, battles, winRate };
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="ml-loading mx-auto mb-3"></div>
        <p>Loading players...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Container fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
            {alert.message}
          </Alert>
        )}

        <div className="text-center mb-5">
          <h2 className="legendary-text">👤 Player Database 👤</h2>
          <p className="text-muted">Manage player profiles and battle statistics in the Mobile Legends arena</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>🎮 Registered Players ({players.length})</h4>
          <Button variant="primary" onClick={handleAddPlayer}>
            ➕ Add New Player
          </Button>
        </div>

        {/* Top Players Leaderboard */}
        {topPlayers.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <h5>🏆 Top Players Leaderboard</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {topPlayers.slice(0, 3).map((player, index) => (
                  <Col key={player.id} md={4} className="mb-3">
                    <Card className={`text-center ${index === 0 ? 'border-warning' : index === 1 ? 'border-info' : 'border-success'}`}>
                      <Card.Body>
                        <div className="mb-2">
                          {index === 0 && <span className="fs-2">🥇</span>}
                          {index === 1 && <span className="fs-2">🥈</span>}
                          {index === 2 && <span className="fs-2">🥉</span>}
                        </div>
                        <h6>{player.name}</h6>
                        <p className="mb-1">
                          <strong>{((player.wins / player.battles) * 100).toFixed(1)}%</strong> Win Rate
                        </p>
                        <small className="text-muted">{player.battles} battles</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Players List */}
        {players.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No players registered yet</h5>
            <p className="text-muted">Add the first player to get started!</p>
          </div>
        ) : (
          <Row>
            {players.map(player => {
              const playerStats = calculatePlayerStats(player);
              return (
                <Col key={player.id} lg={4} md={6} className="mb-4">
                  <Card className="player-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1">{player.name}</h5>
                          <small className="text-muted">{player.email}</small>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowStats(player)}
                        >
                          📊 Stats
                        </Button>
                      </div>

                      <div className="player-info mb-3">
                        <p className="mb-1">
                          <strong>Phone:</strong> {player.phone || 'Not provided'}
                        </p>
                        <p className="mb-1">
                          <strong>Favorite Role:</strong> {player.favoriteRole || 'Not set'}
                        </p>
                        <p className="mb-1">
                          <strong>Joined:</strong> {new Date(player.joinDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="player-stats-summary">
                        <Row className="text-center">
                          <Col xs={4}>
                            <div className="stat-number text-primary">{player.battles || 0}</div>
                            <div className="stat-label">Battles</div>
                          </Col>
                          <Col xs={4}>
                            <div className="stat-number text-success">{player.wins || 0}</div>
                            <div className="stat-label">Wins</div>
                          </Col>
                          <Col xs={4}>
                            <div className="stat-number text-warning">{playerStats.winRate}%</div>
                            <div className="stat-label">Win Rate</div>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Add Player Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>🎮 Add New Player</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSavePlayer}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Player Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter player name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Favorite Role</Form.Label>
                <Form.Select
                  name="favoriteRole"
                  value={formData.favoriteRole}
                  onChange={handleChange}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Player
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Player Stats Modal */}
        <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>📊 Player Statistics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPlayer && (
              <PlayerStats
                player={selectedPlayer}
                battles={getBattlesByPlayer(selectedPlayer.id)}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default PelangganPage;
