// Sample heroes data for Mobile Legends theme
export const defaultHeroes = [
  {
    id: 1,
    name: 'Alucard',
    role: 'Fighter',
    description: 'A demon hunter with incredible lifesteal abilities and high damage output.',
    power: 85,
    defense: 60,
    speed: 75,
    skills: ['Groundsplitter', 'Whirling Smash', 'Fission Wave'],
    isLegendary: true,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Miya',
    role: 'Marksman',
    description: 'An elven archer with split arrow abilities and stealth mechanics.',
    power: 80,
    defense: 45,
    speed: 85,
    skills: ['Moon Arrow', 'Arrow of Eclipse', 'Turbo Stealth'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Tigreal',
    role: 'Tank',
    description: 'A mighty warrior with powerful crowd control and defensive abilities.',
    power: 60,
    defense: 95,
    speed: 50,
    skills: ['Attack Wave', 'Sacred Hammer', 'Implosion'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Gusion',
    role: 'Assassin',
    description: 'A magical assassin with teleportation abilities and burst damage.',
    power: 90,
    defense: 40,
    speed: 95,
    skills: ['Sword Spike', 'Shadowblade Slaughter', 'Incandescence'],
    isLegendary: true,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    name: 'Eudora',
    role: 'Mage',
    description: 'A lightning mage with powerful area-of-effect spells and stun abilities.',
    power: 85,
    defense: 50,
    speed: 65,
    skills: ['Forked Lightning', 'Electric Arrow', 'Thunderstruck'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    name: 'Rafaela',
    role: 'Support',
    description: 'An angelic support with healing abilities and crowd control.',
    power: 55,
    defense: 70,
    speed: 60,
    skills: ['Light of Retribution', 'Healing Prayer', 'Holy Baptism'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    name: 'Layla',
    role: 'Marksman',
    description: 'A gunner with long-range attacks and explosive ammunition.',
    power: 75,
    defense: 35,
    speed: 70,
    skills: ['Malefic Bomb', 'Void Projectile', 'Destruction Rush'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
  },
  {
    id: 8,
    name: 'Balmond',
    role: 'Fighter',
    description: 'A berserker with regeneration abilities and spinning attacks.',
    power: 80,
    defense: 75,
    speed: 55,
    skills: ['Soul Lock', 'Cyclone Sweep', 'Lethal Counter'],
    isLegendary: false,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  }
];

// Hero management functions
export const getHeroes = () => {
  const stored = localStorage.getItem('ml_heroes');
  return stored ? JSON.parse(stored) : defaultHeroes;
};

export const saveHeroes = (heroes) => {
  localStorage.setItem('ml_heroes', JSON.stringify(heroes));
};

export const addHero = (hero) => {
  const heroes = getHeroes();
  const newHero = {
    ...hero,
    id: Date.now(),
    image: hero.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  };
  heroes.push(newHero);
  saveHeroes(heroes);
  return newHero;
};

export const updateHero = (updatedHero) => {
  const heroes = getHeroes();
  const index = heroes.findIndex(hero => hero.id === updatedHero.id);
  if (index !== -1) {
    heroes[index] = updatedHero;
    saveHeroes(heroes);
    return updatedHero;
  }
  return null;
};

export const deleteHero = (heroId) => {
  const heroes = getHeroes();
  const filteredHeroes = heroes.filter(hero => hero.id !== heroId);
  saveHeroes(filteredHeroes);
  return filteredHeroes;
};

export const getHeroById = (id) => {
  const heroes = getHeroes();
  return heroes.find(hero => hero.id === parseInt(id));
};

export const getHeroesByRole = (role) => {
  const heroes = getHeroes();
  return role === 'All' ? heroes : heroes.filter(hero => hero.role === role);
};

export const searchHeroes = (searchTerm) => {
  const heroes = getHeroes();
  return heroes.filter(hero => 
    hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const sortHeroes = (heroes, sortBy) => {
  return [...heroes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'power':
        return b.power - a.power;
      case 'defense':
        return b.defense - a.defense;
      case 'speed':
        return b.speed - a.speed;
      case 'role':
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });
};
