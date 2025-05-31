// Battle management system
export const getBattles = () => {
  const stored = localStorage.getItem('ml_battles');
  return stored ? JSON.parse(stored) : [];
};

export const saveBattles = (battles) => {
  localStorage.setItem('ml_battles', JSON.stringify(battles));
};

export const addBattle = (battleData) => {
  const battles = getBattles();
  const newBattle = {
    id: Date.now(),
    ...battleData,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  };
  battles.push(newBattle);
  saveBattles(battles);
  return newBattle;
};

export const getBattlesByPlayer = (playerId) => {
  const battles = getBattles();
  return battles.filter(battle => 
    battle.player1Id === playerId || battle.player2Id === playerId
  );
};

export const getBattleStats = () => {
  const battles = getBattles();
  const totalBattles = battles.length;
  
  const heroUsage = battles.reduce((acc, battle) => {
    acc[battle.player1Hero] = (acc[battle.player1Hero] || 0) + 1;
    acc[battle.player2Hero] = (acc[battle.player2Hero] || 0) + 1;
    return acc;
  }, {});

  const roleStats = battles.reduce((acc, battle) => {
    acc[battle.player1Role] = (acc[battle.player1Role] || 0) + 1;
    acc[battle.player2Role] = (acc[battle.player2Role] || 0) + 1;
    return acc;
  }, {});

  const mostUsedHero = Object.keys(heroUsage).reduce((a, b) => 
    heroUsage[a] > heroUsage[b] ? a : b, 'None'
  );

  const mostUsedRole = Object.keys(roleStats).reduce((a, b) => 
    roleStats[a] > roleStats[b] ? a : b, 'None'
  );

  return {
    totalBattles,
    heroUsage,
    roleStats,
    mostUsedHero,
    mostUsedRole,
    recentBattles: battles.slice(-10).reverse()
  };
};

// Player management
export const getPlayers = () => {
  const stored = localStorage.getItem('ml_players');
  return stored ? JSON.parse(stored) : [];
};

export const savePlayers = (players) => {
  localStorage.setItem('ml_players', JSON.stringify(players));
};

export const addPlayer = (playerData) => {
  const players = getPlayers();
  const newPlayer = {
    id: Date.now(),
    ...playerData,
    joinDate: new Date().toISOString(),
    battles: 0,
    wins: 0,
    losses: 0
  };
  players.push(newPlayer);
  savePlayers(players);
  return newPlayer;
};

export const updatePlayerStats = (playerId, battleResult) => {
  const players = getPlayers();
  const playerIndex = players.findIndex(p => p.id === playerId);
  
  if (playerIndex !== -1) {
    players[playerIndex].battles += 1;
    if (battleResult === 'win') {
      players[playerIndex].wins += 1;
    } else {
      players[playerIndex].losses += 1;
    }
    savePlayers(players);
    return players[playerIndex];
  }
  return null;
};

export const getPlayerById = (id) => {
  const players = getPlayers();
  return players.find(player => player.id === parseInt(id));
};

export const getTopPlayers = (limit = 10) => {
  const players = getPlayers();
  return players
    .filter(player => player.battles > 0)
    .sort((a, b) => {
      const aWinRate = a.battles > 0 ? (a.wins / a.battles) : 0;
      const bWinRate = b.battles > 0 ? (b.wins / b.battles) : 0;
      return bWinRate - aWinRate;
    })
    .slice(0, limit);
};
