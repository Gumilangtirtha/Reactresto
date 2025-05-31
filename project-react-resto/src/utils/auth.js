// Authentication utilities for Mobile Legends Hero Management System

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('ml_current_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Set current user in localStorage
export const setCurrentUser = (user) => {
  try {
    localStorage.setItem('ml_current_user', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
};

// Remove current user from localStorage
export const removeCurrentUser = () => {
  try {
    localStorage.removeItem('ml_current_user');
    return true;
  } catch (error) {
    console.error('Error removing current user:', error);
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user !== null;
};

// Check if current user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.username === 'admin');
};

// Check if current user is player
export const isPlayer = () => {
  const user = getCurrentUser();
  return user && (user.role === 'user' || user.role === 'player');
};

// Login function
export const login = async (username, password) => {
  try {
    // Demo authentication - in real app, this would call an API
    if (username === 'admin' && password === 'password') {
      const adminUser = {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        role: 'admin',
        email: 'admin@mobilelegends.com',
        loginTime: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }
    
    // Check if user exists in registered players
    const players = JSON.parse(localStorage.getItem('ml_players') || '[]');
    const player = players.find(p => p.username === username);
    
    if (player && player.password === password) {
      const playerUser = {
        id: player.id,
        username: player.username,
        name: player.name,
        role: 'player',
        email: player.email,
        loginTime: new Date().toISOString()
      };
      setCurrentUser(playerUser);
      return { success: true, user: playerUser };
    }
    
    return { success: false, message: 'Invalid username or password' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

// Register function
export const register = async (userData) => {
  try {
    const { name, username, email, password } = userData;
    
    // Check if username already exists
    const players = JSON.parse(localStorage.getItem('ml_players') || '[]');
    const existingPlayer = players.find(p => p.username === username || p.email === email);
    
    if (existingPlayer) {
      return { success: false, message: 'Username or email already exists' };
    }
    
    // Create new player
    const newPlayer = {
      id: Date.now(),
      name,
      username,
      email,
      password, // In real app, this should be hashed
      role: 'player',
      joinDate: new Date().toISOString(),
      battles: 0,
      wins: 0,
      losses: 0,
      favoriteRole: 'Fighter'
    };
    
    // Save to players list
    players.push(newPlayer);
    localStorage.setItem('ml_players', JSON.stringify(players));
    
    // Auto login after registration
    const playerUser = {
      id: newPlayer.id,
      username: newPlayer.username,
      name: newPlayer.name,
      role: 'player',
      email: newPlayer.email,
      loginTime: new Date().toISOString()
    };
    setCurrentUser(playerUser);
    
    return { success: true, user: playerUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

// Logout function
export const logout = () => {
  try {
    removeCurrentUser();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Logout failed' };
  }
};

// Get user permissions
export const getUserPermissions = () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  if (isAdmin()) {
    return [
      'view_heroes',
      'add_hero',
      'edit_hero',
      'delete_hero',
      'view_players',
      'add_player',
      'edit_player',
      'delete_player',
      'view_battles',
      'manage_battles',
      'view_statistics',
      'admin_panel'
    ];
  }
  
  if (isPlayer()) {
    return [
      'view_heroes',
      'view_players',
      'view_battles',
      'start_battle',
      'view_own_statistics'
    ];
  }
  
  return [];
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

// Initialize auth system
export const initAuth = () => {
  // Clean up expired sessions if needed
  const user = getCurrentUser();
  if (user && user.loginTime) {
    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    // Auto logout after 24 hours
    if (hoursDiff > 24) {
      logout();
    }
  }
};
