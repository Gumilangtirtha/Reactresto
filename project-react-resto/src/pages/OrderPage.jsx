import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Modal } from 'react-bootstrap';
import BattleArena from '../components/BattleArena';
import { getHeroes } from '../data/heroesData';
import { getBattles, addBattle, getBattleStats } from '../data/battleData';

const OrderPage = () => {
  const [heroes, setHeroes] = useState([]);
  const [selectedHero1, setSelectedHero1] = useState(null);
  const [selectedHero2, setSelectedHero2] = useState(null);
  const [showBattle, setShowBattle] = useState(false);
  const [battles, setBattles] = useState([]);
  const [battleStats, setBattleStats] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showHeroSelection, setShowHeroSelection] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null); // 'player1' or 'player2'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const heroesData = getHeroes();
    const battlesData = getBattles();
    const statsData = getBattleStats();

    setHeroes(heroesData);
    setBattles(battlesData);
    setBattleStats(statsData);
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleSelectHero = (hero, player) => {
    if (player === 'player1') {
      setSelectedHero1(hero);
    } else {
      setSelectedHero2(hero);
    }
    setShowHeroSelection(false);
    showAlert(`${hero.name} selected for ${player === 'player1' ? 'Player 1' : 'Player 2'}!`, 'info');
  };

  const openHeroSelection = (player) => {
    setSelectingFor(player);
    setShowHeroSelection(true);
  };

  const startBattle = () => {
    if (!selectedHero1 || !selectedHero2) {
      showAlert('Please select heroes for both players!', 'warning');
      return;
    }

    if (selectedHero1.id === selectedHero2.id) {
      showAlert('Please select different heroes for each player!', 'warning');
      return;
    }

    setShowBattle(true);
  };

  const handleBattleEnd = (winner) => {
    const battleData = {
      player1Hero: selectedHero1.name,
      player2Hero: selectedHero2.name,
      player1Role: selectedHero1.role,
      player2Role: selectedHero2.role,
      winner: winner.name,
      winnerId: winner.id,
      player1Id: 1, // Demo player IDs
      player2Id: 2,
      duration: Math.floor(Math.random() * 300) + 60 // Random duration 1-5 minutes
    };

    addBattle(battleData);
    loadData();
    setShowBattle(false);
    showAlert(`Battle completed! ${winner.name} is victorious!`, 'success');
  };

  const resetSelection = () => {
    setSelectedHero1(null);
    setSelectedHero2(null);
    setShowBattle(false);
  };

  return (
    <div className="p-4">
      <Container fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
            {alert.message}
          </Alert>
        )}

        <div className="text-center mb-5">
          <h2 className="legendary-text">⚡ Battle Arena ⚡</h2>
          <p className="text-muted">Choose your heroes and engage in epic battles!</p>
        </div>

        {/* Battle Statistics */}
        {battleStats && (
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-primary">{battleStats.totalBattles}</h3>
                  <small className="text-muted">Total Battles</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-success">{battleStats.mostUsedHero}</h3>
                  <small className="text-muted">Most Used Hero</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-warning">{battleStats.mostUsedRole}</h3>
                  <small className="text-muted">Most Used Role</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-info">{battleStats.recentBattles.length}</h3>
                  <small className="text-muted">Recent Battles</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {!showBattle ? (
          <>
            {/* Hero Selection */}
            <Row className="mb-4">
              <Col md={5}>
                <Card className="hero-selection-card">
                  <Card.Header className="text-center">
                    <h5>👤 Player 1</h5>
                  </Card.Header>
                  <Card.Body className="text-center">
                    {selectedHero1 ? (
                      <div>
                        <h4 className="text-primary">{selectedHero1.name}</h4>
                        <p className="text-muted">{selectedHero1.role}</p>
                        <div className="hero-stats">
                          <small>⚔️ {selectedHero1.power} | 🛡️ {selectedHero1.defense} | ⚡ {selectedHero1.speed}</small>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-2"
                          onClick={() => openHeroSelection('player1')}
                        >
                          Change Hero
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted">No hero selected</p>
                        <Button
                          variant="primary"
                          onClick={() => openHeroSelection('player1')}
                        >
                          Select Hero
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={2} className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="text-muted">VS</h1>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={startBattle}
                    disabled={!selectedHero1 || !selectedHero2}
                    className="battle-btn"
                  >
                    🔥 Start Battle
                  </Button>
                  <br />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={resetSelection}
                  >
                    🔄 Reset
                  </Button>
                </div>
              </Col>

              <Col md={5}>
                <Card className="hero-selection-card">
                  <Card.Header className="text-center">
                    <h5>🤖 Player 2</h5>
                  </Card.Header>
                  <Card.Body className="text-center">
                    {selectedHero2 ? (
                      <div>
                        <h4 className="text-danger">{selectedHero2.name}</h4>
                        <p className="text-muted">{selectedHero2.role}</p>
                        <div className="hero-stats">
                          <small>⚔️ {selectedHero2.power} | 🛡️ {selectedHero2.defense} | ⚡ {selectedHero2.speed}</small>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => openHeroSelection('player2')}
                        >
                          Change Hero
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-muted">No hero selected</p>
                        <Button
                          variant="danger"
                          onClick={() => openHeroSelection('player2')}
                        >
                          Select Hero
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Battles */}
            {battles.length > 0 && (
              <Card>
                <Card.Header>
                  <h5>📊 Recent Battles</h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {battles.slice(-10).reverse().map((battle, index) => (
                      <div key={battle.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <strong>{battle.player1Hero}</strong> vs <strong>{battle.player2Hero}</strong>
                          <br />
                          <small className="text-muted">{battle.date}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">Winner: {battle.winner}</div>
                          <small className="text-muted">{battle.duration}s</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        ) : (
          <BattleArena
            player1Hero={selectedHero1}
            player2Hero={selectedHero2}
            onBattleEnd={handleBattleEnd}
          />
        )}

        {/* Hero Selection Modal */}
        <Modal show={showHeroSelection} onHide={() => setShowHeroSelection(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Select Hero for {selectingFor === 'player1' ? 'Player 1' : 'Player 2'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {heroes.map(hero => (
                <Col key={hero.id} md={4} className="mb-3">
                  <Card
                    className="hero-selection-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectHero(hero, selectingFor)}
                  >
                    <Card.Body className="text-center">
                      <h6>{hero.name}</h6>
                      <p className="text-muted mb-1">{hero.role}</p>
                      <small>⚔️ {hero.power} | 🛡️ {hero.defense} | ⚡ {hero.speed}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default OrderPage;
