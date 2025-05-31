import React from 'react';
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap';

const PlayerStats = ({ player, battles = [] }) => {
  const calculateStats = () => {
    const totalBattles = battles.length;
    const wins = battles.filter(battle => battle.winner === player.id).length;
    const losses = totalBattles - wins;
    const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(1) : 0;
    
    const favoriteHero = battles.reduce((acc, battle) => {
      const hero = battle.playerHero;
      acc[hero] = (acc[hero] || 0) + 1;
      return acc;
    }, {});
    
    const mostUsedHero = Object.keys(favoriteHero).reduce((a, b) => 
      favoriteHero[a] > favoriteHero[b] ? a : b, 'None'
    );

    return {
      totalBattles,
      wins,
      losses,
      winRate,
      mostUsedHero
    };
  };

  const stats = calculateStats();

  const getRankBadge = (winRate) => {
    if (winRate >= 80) return { variant: 'warning', text: '🏆 Legendary', rank: 'Legendary' };
    if (winRate >= 60) return { variant: 'primary', text: '💎 Epic', rank: 'Epic' };
    if (winRate >= 40) return { variant: 'info', text: '🔷 Elite', rank: 'Elite' };
    if (winRate >= 20) return { variant: 'success', text: '🥉 Master', rank: 'Master' };
    return { variant: 'secondary', text: '🥈 Warrior', rank: 'Warrior' };
  };

  const rankInfo = getRankBadge(stats.winRate);

  return (
    <Card className="player-stats-card">
      <Card.Header className="text-center">
        <h5>👤 Player Statistics</h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center mb-4">
          <h4 className="hero-glow">{player.name || 'Player'}</h4>
          <Badge bg={rankInfo.variant} className="fs-6">
            {rankInfo.text}
          </Badge>
        </div>

        <Row className="mb-3">
          <Col md={6}>
            <div className="stat-item text-center">
              <div className="stat-number text-primary">{stats.totalBattles}</div>
              <div className="stat-label">Total Battles</div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-item text-center">
              <div className="stat-number text-success">{stats.wins}</div>
              <div className="stat-label">Victories</div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div className="stat-item text-center">
              <div className="stat-number text-danger">{stats.losses}</div>
              <div className="stat-label">Defeats</div>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-item text-center">
              <div className="stat-number text-warning">{stats.winRate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </Col>
        </Row>

        <div className="mb-3">
          <label className="form-label">Win Rate Progress</label>
          <ProgressBar 
            variant={rankInfo.variant.replace('warning', 'success')} 
            now={stats.winRate} 
            label={`${stats.winRate}%`}
          />
        </div>

        <div className="text-center">
          <small className="text-muted">Most Used Hero</small>
          <div className="fw-bold text-primary">{stats.mostUsedHero}</div>
        </div>

        {/* Recent Battles */}
        {battles.length > 0 && (
          <div className="mt-4">
            <h6>📊 Recent Battles</h6>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {battles.slice(-5).reverse().map((battle, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                  <small>{battle.playerHero} vs {battle.opponentHero}</small>
                  <Badge bg={battle.winner === player.id ? 'success' : 'danger'}>
                    {battle.winner === player.id ? 'Win' : 'Loss'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="mt-4">
          <h6>🏅 Achievements</h6>
          <div className="d-flex flex-wrap gap-1">
            {stats.totalBattles >= 1 && (
              <Badge bg="info">First Battle</Badge>
            )}
            {stats.wins >= 5 && (
              <Badge bg="success">5 Victories</Badge>
            )}
            {stats.winRate >= 50 && (
              <Badge bg="primary">50% Win Rate</Badge>
            )}
            {stats.totalBattles >= 10 && (
              <Badge bg="warning">Veteran</Badge>
            )}
            {stats.winRate >= 80 && (
              <Badge bg="danger">Legendary</Badge>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlayerStats;
