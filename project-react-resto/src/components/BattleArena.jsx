import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, ProgressBar, Badge, Alert } from 'react-bootstrap';

const BattleArena = ({ player1Hero, player2Hero, onBattleEnd }) => {
  const [battleState, setBattleState] = useState('ready'); // ready, fighting, finished
  const [battleLog, setBattleLog] = useState([]);
  const [player1HP, setPlayer1HP] = useState(100);
  const [player2HP, setPlayer2HP] = useState(100);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [winner, setWinner] = useState(null);

  const calculateDamage = (attacker, defender) => {
    const baseDamage = attacker.power || 50;
    const defense = defender.defense || 50;
    const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    
    const damage = Math.max(5, Math.floor((baseDamage - defense * 0.3) * randomFactor));
    return damage;
  };

  const performAttack = (attacker, defender, attackerHP, defenderHP, setDefenderHP) => {
    const damage = calculateDamage(attacker, defender);
    const newHP = Math.max(0, defenderHP - damage);
    setDefenderHP(newHP);
    
    const logEntry = `${attacker.name} attacks ${defender.name} for ${damage} damage! (${newHP} HP remaining)`;
    setBattleLog(prev => [...prev, logEntry]);
    
    return newHP;
  };

  const startBattle = () => {
    setBattleState('fighting');
    setBattleLog([`⚔️ Battle begins! ${player1Hero.name} vs ${player2Hero.name}`]);
    setPlayer1HP(100);
    setPlayer2HP(100);
    setCurrentTurn(1);
    setWinner(null);
  };

  const nextTurn = () => {
    if (battleState !== 'fighting') return;

    if (currentTurn === 1) {
      // Player 1 attacks
      const newP2HP = performAttack(player1Hero, player2Hero, player1HP, player2HP, setPlayer2HP);
      if (newP2HP <= 0) {
        setWinner(player1Hero);
        setBattleState('finished');
        setBattleLog(prev => [...prev, `🏆 ${player1Hero.name} wins the battle!`]);
        return;
      }
      setCurrentTurn(2);
    } else {
      // Player 2 attacks
      const newP1HP = performAttack(player2Hero, player1Hero, player2HP, player1HP, setPlayer1HP);
      if (newP1HP <= 0) {
        setWinner(player2Hero);
        setBattleState('finished');
        setBattleLog(prev => [...prev, `🏆 ${player2Hero.name} wins the battle!`]);
        return;
      }
      setCurrentTurn(1);
    }
  };

  const resetBattle = () => {
    setBattleState('ready');
    setBattleLog([]);
    setPlayer1HP(100);
    setPlayer2HP(100);
    setCurrentTurn(1);
    setWinner(null);
  };

  const getHPVariant = (hp) => {
    if (hp > 60) return 'success';
    if (hp > 30) return 'warning';
    return 'danger';
  };

  return (
    <div className="battle-arena p-4">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="legendary-text">⚔️ Battle Arena ⚔️</h2>
        </Col>
      </Row>

      {/* Hero Cards */}
      <Row className="mb-4">
        <Col md={5}>
          <Card className="hero-card text-center">
            <Card.Body>
              <Card.Title className="text-primary">{player1Hero.name}</Card.Title>
              <Badge bg="primary" className="mb-2">{player1Hero.role}</Badge>
              <ProgressBar 
                variant={getHPVariant(player1HP)} 
                now={player1HP} 
                label={`${player1HP} HP`}
                className="mb-2"
              />
              <div className="hero-stats">
                <small>⚔️ {player1Hero.power || 50} | 🛡️ {player1Hero.defense || 50} | ⚡ {player1Hero.speed || 50}</small>
              </div>
              {currentTurn === 1 && battleState === 'fighting' && (
                <Badge bg="warning" className="mt-2">Your Turn!</Badge>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="text-muted">VS</h1>
            {battleState === 'ready' && (
              <Button variant="success" onClick={startBattle} className="battle-btn">
                🔥 Start Battle
              </Button>
            )}
            {battleState === 'fighting' && (
              <Button variant="primary" onClick={nextTurn} className="battle-btn">
                ⚡ Attack
              </Button>
            )}
            {battleState === 'finished' && (
              <div>
                <Button variant="secondary" onClick={resetBattle} className="mb-2">
                  🔄 Reset
                </Button>
                <br />
                <Button variant="success" onClick={() => onBattleEnd && onBattleEnd(winner)}>
                  🏆 Finish
                </Button>
              </div>
            )}
          </div>
        </Col>

        <Col md={5}>
          <Card className="hero-card text-center">
            <Card.Body>
              <Card.Title className="text-danger">{player2Hero.name}</Card.Title>
              <Badge bg="danger" className="mb-2">{player2Hero.role}</Badge>
              <ProgressBar 
                variant={getHPVariant(player2HP)} 
                now={player2HP} 
                label={`${player2HP} HP`}
                className="mb-2"
              />
              <div className="hero-stats">
                <small>⚔️ {player2Hero.power || 50} | 🛡️ {player2Hero.defense || 50} | ⚡ {player2Hero.speed || 50}</small>
              </div>
              {currentTurn === 2 && battleState === 'fighting' && (
                <Badge bg="warning" className="mt-2">Enemy Turn!</Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Battle Log */}
      {battleLog.length > 0 && (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5>📜 Battle Log</h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {battleLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    <small className="text-muted">[Turn {Math.ceil((index + 1) / 2)}]</small> {log}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Winner Announcement */}
      {winner && (
        <Row className="mt-4">
          <Col>
            <Alert variant="success" className="text-center">
              <h4>🎉 Victory! 🎉</h4>
              <p className="mb-0">
                <strong>{winner.name}</strong> emerges victorious in this epic battle!
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BattleArena;
