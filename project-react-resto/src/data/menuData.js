// Data menu restoran dengan kategori dan item lengkap
export const menuCategories = [
  {
    id: 1,
    name: "Appetizers",
    icon: "🥗",
    description: "Pembuka selera yang menggugah"
  },
  {
    id: 2,
    name: "Main Course",
    icon: "🍽️",
    description: "Hidangan utama yang memuaskan"
  },
  {
    id: 3,
    name: "Desserts",
    icon: "🍰",
    description: "Penutup manis yang memanjakan"
  },
  {
    id: 4,
    name: "Beverages",
    icon: "🥤",
    description: "Minuman segar dan hangat"
  },
  {
    id: 5,
    name: "Signature",
    icon: "⭐",
    description: "Menu spesial chef recommendation"
  }
];

export const menuItems = [
  // Appetizers
  {
    id: 1,
    name: "Caesar Salad Supreme",
    category: "Appetizers",
    categoryId: 1,
    price: 85000,
    description: "Selada romaine segar dengan dressing caesar klasik, crouton renyah, dan parmesan cheese",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: true,
    isNew: false,
    ingredients: ["Romaine lettuce", "Caesar dressing", "Parmesan", "Croutons", "Anchovies"],
    allergens: ["Gluten", "Dairy", "Fish"],
    preparationTime: "10 mins",
    calories: 320
  },
  {
    id: 2,
    name: "Truffle Mushroom Bruschetta",
    category: "Appetizers",
    categoryId: 1,
    price: 95000,
    description: "Roti artisan panggang dengan topping jamur truffle, herbs segar, dan mozzarella leleh",
    image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: false,
    isNew: true,
    ingredients: ["Artisan bread", "Truffle mushrooms", "Mozzarella", "Fresh herbs"],
    allergens: ["Gluten", "Dairy"],
    preparationTime: "15 mins",
    calories: 280
  },
  {
    id: 3,
    name: "Crispy Calamari Rings",
    category: "Appetizers",
    categoryId: 1,
    price: 78000,
    description: "Cumi-cumi segar dibalut tepung rempah, disajikan dengan marinara sauce dan aioli",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: true,
    isNew: false,
    ingredients: ["Fresh squid", "Seasoned flour", "Marinara sauce", "Garlic aioli"],
    allergens: ["Gluten", "Seafood"],
    preparationTime: "12 mins",
    calories: 350
  },

  // Main Course
  {
    id: 4,
    name: "Wagyu Beef Tenderloin",
    category: "Main Course",
    categoryId: 2,
    price: 450000,
    description: "Premium wagyu tenderloin dengan black pepper sauce, roasted vegetables, dan truffle mashed potato",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: true,
    isNew: false,
    ingredients: ["Wagyu beef", "Black pepper sauce", "Truffle mashed potato", "Roasted vegetables"],
    allergens: ["Dairy"],
    preparationTime: "25 mins",
    calories: 680
  },
  {
    id: 5,
    name: "Lobster Thermidor",
    category: "Main Course",
    categoryId: 2,
    price: 380000,
    description: "Lobster segar dengan saus thermidor klasik, gratinated dengan keju gruyere",
    image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: true,
    isNew: false,
    ingredients: ["Fresh lobster", "Thermidor sauce", "Gruyere cheese", "White wine"],
    allergens: ["Seafood", "Dairy", "Alcohol"],
    preparationTime: "30 mins",
    calories: 520
  },
  {
    id: 6,
    name: "Duck Confit with Orange Glaze",
    category: "Main Course",
    categoryId: 2,
    price: 285000,
    description: "Bebek confit dengan glaze jeruk, disajikan dengan wild rice dan seasonal vegetables",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    rating: 4.7,
    isPopular: false,
    isNew: true,
    ingredients: ["Duck leg", "Orange glaze", "Wild rice", "Seasonal vegetables"],
    allergens: [],
    preparationTime: "35 mins",
    calories: 590
  },
  {
    id: 7,
    name: "Seafood Paella Valenciana",
    category: "Main Course",
    categoryId: 2,
    price: 320000,
    description: "Paella tradisional dengan seafood segar, saffron rice, dan rempah-rempah Spanyol",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: true,
    isNew: false,
    ingredients: ["Bomba rice", "Mixed seafood", "Saffron", "Spanish spices"],
    allergens: ["Seafood"],
    preparationTime: "40 mins",
    calories: 480
  },

  // Desserts
  {
    id: 8,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    categoryId: 3,
    price: 65000,
    description: "Warm chocolate cake dengan molten center, vanilla ice cream, dan berry compote",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: true,
    isNew: false,
    ingredients: ["Dark chocolate", "Vanilla ice cream", "Mixed berries", "Mint"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    preparationTime: "15 mins",
    calories: 420
  },
  {
    id: 9,
    name: "Tiramisu Classico",
    category: "Desserts",
    categoryId: 3,
    price: 58000,
    description: "Tiramisu klasik dengan ladyfinger, mascarpone, espresso, dan cocoa powder",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: true,
    isNew: false,
    ingredients: ["Mascarpone", "Ladyfingers", "Espresso", "Cocoa powder"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    preparationTime: "5 mins",
    calories: 380
  },
  {
    id: 10,
    name: "Crème Brûlée Trio",
    category: "Desserts",
    categoryId: 3,
    price: 72000,
    description: "Tiga varian crème brûlée: vanilla, lavender, dan passion fruit",
    image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400&h=300&fit=crop",
    rating: 4.7,
    isPopular: false,
    isNew: true,
    ingredients: ["Heavy cream", "Vanilla", "Lavender", "Passion fruit"],
    allergens: ["Dairy", "Eggs"],
    preparationTime: "8 mins",
    calories: 340
  },

  // Beverages
  {
    id: 11,
    name: "Signature Coffee Blend",
    category: "Beverages",
    categoryId: 4,
    price: 45000,
    description: "House blend coffee dengan notes chocolate dan caramel, disajikan panas atau dingin",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: true,
    isNew: false,
    ingredients: ["House blend coffee", "Steamed milk", "Optional syrups"],
    allergens: ["Dairy"],
    preparationTime: "5 mins",
    calories: 120
  },
  {
    id: 12,
    name: "Fresh Fruit Mocktail",
    category: "Beverages",
    categoryId: 4,
    price: 38000,
    description: "Mocktail segar dengan buah-buahan seasonal, mint, dan sparkling water",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
    rating: 4.5,
    isPopular: false,
    isNew: true,
    ingredients: ["Seasonal fruits", "Fresh mint", "Sparkling water", "Honey"],
    allergens: [],
    preparationTime: "7 mins",
    calories: 85
  },
  {
    id: 13,
    name: "Artisan Tea Selection",
    category: "Beverages",
    categoryId: 4,
    price: 42000,
    description: "Pilihan teh premium: Earl Grey, Jasmine Green, atau Chamomile",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    rating: 4.4,
    isPopular: false,
    isNew: false,
    ingredients: ["Premium tea leaves", "Hot water", "Optional honey/lemon"],
    allergens: [],
    preparationTime: "5 mins",
    calories: 5
  },

  // More Appetizers
  {
    id: 16,
    name: "Tuna Tartare with Avocado",
    category: "Appetizers",
    categoryId: 1,
    price: 125000,
    description: "Fresh tuna tartare dengan avocado mousse, sesame oil, dan microgreens",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    rating: 4.7,
    isPopular: true,
    isNew: false,
    ingredients: ["Fresh tuna", "Avocado", "Sesame oil", "Microgreens"],
    allergens: ["Seafood"],
    preparationTime: "15 mins",
    calories: 280
  },
  {
    id: 17,
    name: "Burrata with Prosciutto",
    category: "Appetizers",
    categoryId: 1,
    price: 98000,
    description: "Creamy burrata cheese dengan prosciutto di Parma, arugula, dan balsamic glaze",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: false,
    isNew: true,
    ingredients: ["Burrata cheese", "Prosciutto di Parma", "Arugula", "Balsamic glaze"],
    allergens: ["Dairy"],
    preparationTime: "8 mins",
    calories: 320
  },
  {
    id: 18,
    name: "Oysters Rockefeller",
    category: "Appetizers",
    categoryId: 1,
    price: 145000,
    description: "Fresh oysters dengan spinach, herbs, dan parmesan cheese, dipanggang sempurna",
    image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: false,
    isNew: false,
    ingredients: ["Fresh oysters", "Spinach", "Herbs", "Parmesan cheese"],
    allergens: ["Seafood", "Dairy"],
    preparationTime: "20 mins",
    calories: 180
  },

  // More Main Course
  {
    id: 19,
    name: "Grilled Salmon Teriyaki",
    category: "Main Course",
    categoryId: 2,
    price: 195000,
    description: "Atlantic salmon dengan teriyaki glaze, jasmine rice, dan steamed vegetables",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    rating: 4.5,
    isPopular: true,
    isNew: false,
    ingredients: ["Atlantic salmon", "Teriyaki sauce", "Jasmine rice", "Steamed vegetables"],
    allergens: ["Seafood"],
    preparationTime: "25 mins",
    calories: 420
  },
  {
    id: 20,
    name: "Lamb Rack with Mint Sauce",
    category: "Main Course",
    categoryId: 2,
    price: 350000,
    description: "New Zealand lamb rack dengan mint sauce, roasted potatoes, dan seasonal vegetables",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: false,
    isNew: true,
    ingredients: ["New Zealand lamb", "Mint sauce", "Roasted potatoes", "Seasonal vegetables"],
    allergens: [],
    preparationTime: "35 mins",
    calories: 650
  },
  {
    id: 21,
    name: "Chicken Cordon Bleu",
    category: "Main Course",
    categoryId: 2,
    price: 165000,
    description: "Chicken breast stuffed dengan ham dan swiss cheese, dengan cream sauce",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop",
    rating: 4.4,
    isPopular: true,
    isNew: false,
    ingredients: ["Chicken breast", "Ham", "Swiss cheese", "Cream sauce"],
    allergens: ["Dairy"],
    preparationTime: "30 mins",
    calories: 580
  },
  {
    id: 22,
    name: "Vegetarian Risotto",
    category: "Main Course",
    categoryId: 2,
    price: 135000,
    description: "Creamy arborio rice dengan mushrooms, asparagus, dan parmesan cheese",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    rating: 4.3,
    isPopular: false,
    isNew: false,
    ingredients: ["Arborio rice", "Mixed mushrooms", "Asparagus", "Parmesan cheese"],
    allergens: ["Dairy"],
    preparationTime: "25 mins",
    calories: 380
  },
  {
    id: 23,
    name: "Beef Wellington",
    category: "Main Course",
    categoryId: 2,
    price: 425000,
    description: "Premium beef tenderloin wrapped dalam puff pastry dengan mushroom duxelles",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: true,
    isNew: false,
    ingredients: ["Beef tenderloin", "Puff pastry", "Mushroom duxelles", "Foie gras"],
    allergens: ["Gluten", "Dairy"],
    preparationTime: "45 mins",
    calories: 720
  },

  // More Desserts
  {
    id: 24,
    name: "Panna Cotta Berry",
    category: "Desserts",
    categoryId: 3,
    price: 55000,
    description: "Silky vanilla panna cotta dengan mixed berry compote dan mint garnish",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: false,
    isNew: false,
    ingredients: ["Heavy cream", "Vanilla", "Mixed berries", "Mint"],
    allergens: ["Dairy"],
    preparationTime: "10 mins",
    calories: 280
  },
  {
    id: 25,
    name: "Chocolate Soufflé",
    category: "Desserts",
    categoryId: 3,
    price: 78000,
    description: "Light and airy chocolate soufflé dengan vanilla ice cream",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    rating: 4.8,
    isPopular: true,
    isNew: false,
    ingredients: ["Dark chocolate", "Eggs", "Sugar", "Vanilla ice cream"],
    allergens: ["Dairy", "Eggs"],
    preparationTime: "25 mins",
    calories: 350
  },
  {
    id: 26,
    name: "Lemon Tart",
    category: "Desserts",
    categoryId: 3,
    price: 62000,
    description: "Crispy pastry shell dengan lemon curd dan meringue topping",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
    rating: 4.5,
    isPopular: false,
    isNew: true,
    ingredients: ["Pastry shell", "Lemon curd", "Meringue", "Lemon zest"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    preparationTime: "15 mins",
    calories: 320
  },
  {
    id: 27,
    name: "Affogato",
    category: "Desserts",
    categoryId: 3,
    price: 48000,
    description: "Vanilla gelato 'drowned' dalam hot espresso dengan amaretti cookies",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    rating: 4.7,
    isPopular: true,
    isNew: false,
    ingredients: ["Vanilla gelato", "Espresso", "Amaretti cookies"],
    allergens: ["Dairy"],
    preparationTime: "5 mins",
    calories: 180
  },

  // More Beverages
  {
    id: 28,
    name: "Matcha Latte",
    category: "Beverages",
    categoryId: 4,
    price: 52000,
    description: "Premium Japanese matcha dengan steamed milk dan honey",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop",
    rating: 4.4,
    isPopular: true,
    isNew: false,
    ingredients: ["Japanese matcha", "Steamed milk", "Honey"],
    allergens: ["Dairy"],
    preparationTime: "8 mins",
    calories: 140
  },
  {
    id: 29,
    name: "Cold Brew Coffee",
    category: "Beverages",
    categoryId: 4,
    price: 48000,
    description: "Smooth cold brew coffee dengan optional milk atau syrup",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    rating: 4.3,
    isPopular: false,
    isNew: false,
    ingredients: ["Cold brew coffee", "Ice", "Optional milk"],
    allergens: ["Dairy (optional)"],
    preparationTime: "3 mins",
    calories: 15
  },
  {
    id: 30,
    name: "Kombucha Ginger",
    category: "Beverages",
    categoryId: 4,
    price: 45000,
    description: "Fermented tea dengan ginger dan natural probiotics",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop",
    rating: 4.2,
    isPopular: false,
    isNew: true,
    ingredients: ["Fermented tea", "Ginger", "Natural probiotics"],
    allergens: [],
    preparationTime: "5 mins",
    calories: 30
  },
  {
    id: 31,
    name: "Wine Selection",
    category: "Beverages",
    categoryId: 4,
    price: 85000,
    description: "Curated wine selection: Red, White, atau Rosé dari berbagai region",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: true,
    isNew: false,
    ingredients: ["Premium wine", "Various regions"],
    allergens: ["Alcohol", "Sulfites"],
    preparationTime: "2 mins",
    calories: 125
  },

  // Signature
  {
    id: 14,
    name: "Chef's Tasting Menu",
    category: "Signature",
    categoryId: 5,
    price: 850000,
    description: "7-course tasting menu dengan wine pairing, menampilkan kreasi terbaik chef",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    rating: 5.0,
    isPopular: true,
    isNew: false,
    ingredients: ["Seasonal ingredients", "Premium proteins", "Wine pairing"],
    allergens: ["Varies by course"],
    preparationTime: "120 mins",
    calories: 1200
  },
  {
    id: 15,
    name: "Molecular Gastronomy Experience",
    category: "Signature",
    categoryId: 5,
    price: 650000,
    description: "Pengalaman kuliner molekuler dengan teknik modern dan presentasi artistik",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: false,
    isNew: true,
    ingredients: ["Molecular techniques", "Artistic presentation", "Unique flavors"],
    allergens: ["Varies"],
    preparationTime: "45 mins",
    calories: 450
  },
  {
    id: 32,
    name: "Omakase Sushi Experience",
    category: "Signature",
    categoryId: 5,
    price: 750000,
    description: "12-piece premium sushi omakase dengan seasonal fish dari Jepang",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    rating: 4.9,
    isPopular: true,
    isNew: false,
    ingredients: ["Premium sushi rice", "Seasonal fish", "Wasabi", "Soy sauce"],
    allergens: ["Seafood"],
    preparationTime: "60 mins",
    calories: 800
  },
  {
    id: 33,
    name: "Dry-Aged Steak Experience",
    category: "Signature",
    categoryId: 5,
    price: 950000,
    description: "45-day dry-aged wagyu steak dengan truffle butter dan premium sides",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    rating: 5.0,
    isPopular: true,
    isNew: false,
    ingredients: ["45-day dry-aged wagyu", "Truffle butter", "Premium sides"],
    allergens: ["Dairy"],
    preparationTime: "40 mins",
    calories: 900
  },

  // Additional Popular Items
  {
    id: 34,
    name: "Fish & Chips Classic",
    category: "Main Course",
    categoryId: 2,
    price: 125000,
    description: "Beer-battered fish dengan crispy chips, mushy peas, dan tartar sauce",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    rating: 4.3,
    isPopular: true,
    isNew: false,
    ingredients: ["Fresh fish", "Beer batter", "Potatoes", "Tartar sauce"],
    allergens: ["Gluten", "Seafood"],
    preparationTime: "20 mins",
    calories: 650
  },
  {
    id: 35,
    name: "Pasta Carbonara",
    category: "Main Course",
    categoryId: 2,
    price: 115000,
    description: "Classic Roman carbonara dengan pancetta, egg yolk, dan pecorino cheese",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    rating: 4.6,
    isPopular: true,
    isNew: false,
    ingredients: ["Spaghetti", "Pancetta", "Egg yolk", "Pecorino cheese"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    preparationTime: "15 mins",
    calories: 520
  }
];

// Utility functions
export const getMenuByCategory = (categoryId) => {
  return menuItems.filter(item => item.categoryId === categoryId);
};

export const getPopularItems = () => {
  return menuItems.filter(item => item.isPopular);
};

export const getNewItems = () => {
  return menuItems.filter(item => item.isNew);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export const getItemById = (id) => {
  return menuItems.find(item => item.id === id);
};
