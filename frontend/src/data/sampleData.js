export const sampleProducts = [
  {
    id: '1',
    name: 'Parle-G',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    mrp: 20,
    pricingTiers: {
      'consumer': { price: 14.00, margin: 30.00 },
      'retailer': { price: 12.00, margin: 40.00 },
      'wholesaler': { price: 10.00, margin: 50.00 }
    },
    stock: 200,
    category: 'Biscuits & Cookies',
    brand: 'Parle',
    description: 'Classic glucose biscuits for daily snacking',
    features: ['Energy-packed', 'Crispy', 'Affordable'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 24,
      boxesPerPack: 4,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '2',
    name: 'Marie Gold',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    mrp: 25,
    pricingTiers: {
      'consumer': { price: 17.50, margin: 30.00 },
      'retailer': { price: 15.00, margin: 40.00 },
      'wholesaler': { price: 12.50, margin: 50.00 }
    },
    stock: 180,
    category: 'Biscuits & Cookies',
    brand: 'Parle',
    description: 'Light and crispy tea biscuits',
    features: ['Low sugar', 'Crispy texture', 'Tea companion'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 20,
      boxesPerPack: 4,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '3',
    name: 'Bourbon',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    mrp: 30,
    pricingTiers: {
      'consumer': { price: 21.00, margin: 30.00 },
      'retailer': { price: 18.00, margin: 40.00 },
      'wholesaler': { price: 15.00, margin: 50.00 }
    },
    stock: 150,
    category: 'Biscuits & Cookies',
    brand: 'Parle',
    description: 'Cream-filled chocolate biscuits',
    features: ['Rich chocolate', 'Creamy filling', 'Crunchy'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 20,
      boxesPerPack: 4,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '4',
    name: 'Good Day',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    mrp: 35,
    pricingTiers: {
      'consumer': { price: 24.50, margin: 30.00 },
      'retailer': { price: 21.00, margin: 40.00 },
      'wholesaler': { price: 17.50, margin: 50.00 }
    },
    stock: 160,
    category: 'Biscuits & Cookies',
    brand: 'Parle',
    description: 'Buttery biscuits with cashew flavor',
    features: ['Rich butter', 'Cashew flavor', 'Premium taste'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 18,
      boxesPerPack: 4,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '5',
    name: 'Hide & Seek',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    mrp: 40,
    pricingTiers: {
      'consumer': { price: 28.00, margin: 30.00 },
      'retailer': { price: 24.00, margin: 40.00 },
      'wholesaler': { price: 20.00, margin: 50.00 }
    },
    stock: 140,
    category: 'Biscuits & Cookies',
    brand: 'Parle',
    description: 'Chocolate chip biscuits',
    features: ['Choco chips', 'Crunchy', 'Rich flavor'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 15,
      boxesPerPack: 4,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '6',
    name: 'Haldiram’s Bhujia',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    mrp: 40,
    pricingTiers: {
      'consumer': { price: 28.00, margin: 30.00 },
      'retailer': { price: 24.00, margin: 40.00 },
      'wholesaler': { price: 20.00, margin: 50.00 }
    },
    stock: 150,
    category: 'Namkeen & Snacks',
    brand: 'Haldiram’s',
    description: 'Spicy and crunchy bhujia',
    features: ['Authentic taste', 'Crunchy', 'Spicy'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 10,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '7',
    name: 'Aloo Bhujia',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    mrp: 35,
    pricingTiers: {
      'consumer': { price: 24.50, margin: 30.00 },
      'retailer': { price: 21.00, margin: 40.00 },
      'wholesaler': { price: 17.50, margin: 50.00 }
    },
    stock: 160,
    category: 'Namkeen & Snacks',
    brand: 'Haldiram’s',
    description: 'Potato-based spicy snack',
    features: ['Potato flavor', 'Crunchy', 'Spicy'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 10,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '8',
    name: 'Navratan Mix',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    mrp: 50,
    pricingTiers: {
      'consumer': { price: 35.00, margin: 30.00 },
      'retailer': { price: 30.00, margin: 40.00 },
      'wholesaler': { price: 25.00, margin: 50.00 }
    },
    stock: 130,
    category: 'Namkeen & Snacks',
    brand: 'Haldiram’s',
    description: 'Mixed savory snack with nuts and spices',
    features: ['Mixed nuts', 'Spicy', 'Crunchy'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 8,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '9',
    name: 'Moong Dal Namkeen',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    mrp: 45,
    pricingTiers: {
      'consumer': { price: 31.50, margin: 30.00 },
      'retailer': { price: 27.00, margin: 40.00 },
      'wholesaler': { price: 22.50, margin: 50.00 }
    },
    stock: 140,
    category: 'Namkeen & Snacks',
    brand: 'Haldiram’s',
    description: 'Crispy moong dal snack',
    features: ['Light snack', 'Crispy', 'Mild flavor'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 10,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '10',
    name: 'Salted Peanuts',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    mrp: 30,
    pricingTiers: {
      'consumer': { price: 21.00, margin: 30.00 },
      'retailer': { price: 18.00, margin: 40.00 },
      'wholesaler': { price: 15.00, margin: 50.00 }
    },
    stock: 170,
    category: 'Namkeen & Snacks',
    brand: 'Haldiram’s',
    description: 'Roasted and salted peanuts',
    features: ['High protein', 'Crunchy', 'Salted'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '11',
    name: 'Rajnigandha Pan Masala',
    image: 'https://images.pexels.com/photos/4198950/pexels-photo-4198950.jpeg',
    mrp: 25,
    pricingTiers: {
      'consumer': { price: 17.50, margin: 30.00 },
      'retailer': { price: 15.00, margin: 40.00 },
      'wholesaler': { price: 12.50, margin: 50.00 }
    },
    stock: 250,
    category: 'Paan Masala / Mouth Freshener',
    brand: 'Rajnigandha',
    description: 'Premium pan masala (Subject to local regulations)',
    features: ['Premium quality', 'Rich taste', 'Fresh ingredients'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 20,
      boxesPerPack: 3,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '12',
    name: 'Tulsi Mouth Freshener',
    image: 'https://images.pexels.com/photos/4198950/pexels-photo-4198950.jpeg',
    mrp: 20,
    pricingTiers: {
      'consumer': { price: 14.00, margin: 30.00 },
      'retailer': { price: 12.00, margin: 40.00 },
      'wholesaler': { price: 10.00, margin: 50.00 }
    },
    stock: 220,
    category: 'Paan Masala / Mouth Freshener',
    brand: 'Tulsi',
    description: 'Natural mouth freshener (Subject to local regulations)',
    features: ['Herbal', 'Fresh breath', 'Non-tobacco'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 20,
      boxesPerPack: 3,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '13',
    name: 'Baba Pan Masala',
    image: 'https://images.pexels.com/photos/4198950/pexels-photo-4198950.jpeg',
    mrp: 22,
    pricingTiers: {
      'consumer': { price: 15.40, margin: 30.00 },
      'retailer': { price: 13.20, margin: 40.00 },
      'wholesaler': { price: 11.00, margin: 50.00 }
    },
    stock: 230,
    category: 'Paan Masala / Mouth Freshener',
    brand: 'Baba',
    description: 'Traditional pan masala (Subject to local regulations)',
    features: ['Rich flavor', 'Traditional mix', 'Quality assured'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 20,
      boxesPerPack: 3,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '14',
    name: 'Elaichi / Saunf Mix',
    image: 'https://images.pexels.com/photos/4198950/pexels-photo-4198950.jpeg',
    mrp: 15,
    pricingTiers: {
      'consumer': { price: 10.50, margin: 30.00 },
      'retailer': { price: 9.00, margin: 40.00 },
      'wholesaler': { price: 7.50, margin: 50.00 }
    },
    stock: 240,
    category: 'Paan Masala / Mouth Freshener',
    brand: 'Tulsi',
    description: 'Non-tobacco cardamom and fennel seed mix',
    features: ['Fresh breath', 'Natural ingredients', 'Digestive'],
    deliveryDays: '1-2 days',
    packaging: {
      unitsPerBox: 25,
      boxesPerPack: 3,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '15',
    name: 'Lifebuoy Soap',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    mrp: 30,
    pricingTiers: {
      'consumer': { price: 21.00, margin: 30.00 },
      'retailer': { price: 18.00, margin: 40.00 },
      'wholesaler': { price: 15.00, margin: 50.00 }
    },
    stock: 120,
    category: 'Soap / Personal Wash',
    brand: 'Lifebuoy',
    description: 'Germ-protection soap for daily use',
    features: ['Antibacterial', 'Long-lasting', 'Fresh fragrance'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '16',
    name: 'Dettol Soap',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    mrp: 35,
    pricingTiers: {
      'consumer': { price: 24.50, margin: 30.00 },
      'retailer': { price: 21.00, margin: 40.00 },
      'wholesaler': { price: 17.50, margin: 50.00 }
    },
    stock: 110,
    category: 'Soap / Personal Wash',
    brand: 'Dettol',
    description: 'Antibacterial soap for daily hygiene',
    features: ['Germ protection', 'Trusted brand', 'Fresh scent'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '17',
    name: 'Lux Soap',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    mrp: 40,
    pricingTiers: {
      'consumer': { price: 28.00, margin: 30.00 },
      'retailer': { price: 24.00, margin: 40.00 },
      'wholesaler': { price: 20.00, margin: 50.00 }
    },
    stock: 100,
    category: 'Soap / Personal Wash',
    brand: 'Lux',
    description: 'Luxury soap with moisturizing properties',
    features: ['Moisturizing', 'Floral fragrance', 'Smooth skin'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '18',
    name: 'Dove Soap',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    mrp: 50,
    pricingTiers: {
      'consumer': { price: 35.00, margin: 30.00 },
      'retailer': { price: 30.00, margin: 40.00 },
      'wholesaler': { price: 25.00, margin: 50.00 }
    },
    stock: 90,
    category: 'Soap / Personal Wash',
    brand: 'Dove',
    description: 'Moisturizing soap for soft skin',
    features: ['Hydrating', 'Gentle on skin', 'Creamy lather'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '19',
    name: 'Santoor Soap',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    mrp: 35,
    pricingTiers: {
      'consumer': { price: 24.50, margin: 30.00 },
      'retailer': { price: 21.00, margin: 40.00 },
      'wholesaler': { price: 17.50, margin: 50.00 }
    },
    stock: 110,
    category: 'Soap / Personal Wash',
    brand: 'Santoor',
    description: 'Soap with sandalwood and turmeric',
    features: ['Natural ingredients', 'Glowing skin', 'Mild fragrance'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 12,
      boxesPerPack: 6,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '20',
    name: 'Clinic Plus Shampoo',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    mrp: 60,
    pricingTiers: {
      'consumer': { price: 42.00, margin: 30.00 },
      'retailer': { price: 36.00, margin: 40.00 },
      'wholesaler': { price: 30.00, margin: 50.00 }
    },
    stock: 100,
    category: 'Shampoo / Hair Care',
    brand: 'Clinic Plus',
    description: 'Strong and healthy hair shampoo',
    features: ['Strengthens hair', 'Nourishes scalp', 'Daily use'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 6,
      boxesPerPack: 8,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '21',
    name: 'Head & Shoulders Shampoo',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    mrp: 80,
    pricingTiers: {
      'consumer': { price: 56.00, margin: 30.00 },
      'retailer': { price: 48.00, margin: 40.00 },
      'wholesaler': { price: 40.00, margin: 50.00 }
    },
    stock: 90,
    category: 'Shampoo / Hair Care',
    brand: 'Head & Shoulders',
    description: 'Anti-dandruff shampoo for healthy scalp',
    features: ['Dandruff control', 'Smooth hair', 'Cooling effect'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 6,
      boxesPerPack: 8,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '22',
    name: 'Sunsilk Shampoo',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    mrp: 70,
    pricingTiers: {
      'consumer': { price: 49.00, margin: 30.00 },
      'retailer': { price: 42.00, margin: 40.00 },
      'wholesaler': { price: 35.00, margin: 50.00 }
    },
    stock: 95,
    category: 'Shampoo / Hair Care',
    brand: 'Sunsilk',
    description: 'Shampoo for smooth and shiny hair',
    features: ['Shiny hair', 'Nourishing', 'Silky texture'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 6,
      boxesPerPack: 8,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '23',
    name: 'Pantene Shampoo',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    mrp: 75,
    pricingTiers: {
      'consumer': { price: 52.50, margin: 30.00 },
      'retailer': { price: 45.00, margin: 40.00 },
      'wholesaler': { price: 37.50, margin: 50.00 }
    },
    stock: 90,
    category: 'Shampoo / Hair Care',
    brand: 'Pantene',
    description: 'Shampoo for nourished and strong hair',
    features: ['Hair nourishment', 'Reduces hair fall', 'Smooth finish'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 6,
      boxesPerPack: 8,
      minBoxes: 1,
      maxBoxes: 5
    }
  },
  {
    id: '24',
    name: 'Dove Shampoo',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    mrp: 85,
    pricingTiers: {
      'consumer': { price: 59.50, margin: 30.00 },
      'retailer': { price: 51.00, margin: 40.00 },
      'wholesaler': { price: 42.50, margin: 50.00 }
    },
    stock: 85,
    category: 'Shampoo / Hair Care',
    brand: 'Dove',
    description: 'Shampoo for soft and hydrated hair',
    features: ['Moisturizing', 'Gentle cleansing', 'Smooth hair'],
    deliveryDays: '2-3 days',
    packaging: {
      unitsPerBox: 6,
      boxesPerPack: 8,
      minBoxes: 1,
      maxBoxes: 5
    }
  }
];

export const sampleBrands = [
  { id: '1', name: 'Parle', logo: '🍪', description: 'Trusted biscuit brand' },
  { id: '2', name: 'Haldiram’s', logo: '🥨', description: 'Authentic Indian snacks' },
  { id: '3', name: 'Rajnigandha', logo: '🌿', description: 'Premium pan masala' },
  { id: '4', name: 'Tulsi', logo: '🌿', description: 'Quality mouth fresheners' },
  { id: '5', name: 'Baba', logo: '🌿', description: 'Traditional pan masala' },
  { id: '6', name: 'Lifebuoy', logo: '🧼', description: 'Germ-protection soaps' },
  { id: '7', name: 'Dettol', logo: '🧼', description: 'Antibacterial personal care' },
  { id: '8', name: 'Lux', logo: '🧼', description: 'Luxury soap brand' },
  { id: '9', name: 'Dove', logo: '🧼', description: 'Moisturizing personal care' },
  { id: '10', name: 'Santoor', logo: '🧼', description: 'Skin-nourishing soaps' },
  { id: '11', name: 'Clinic Plus', logo: '🧴', description: 'Strong and healthy hair' },
  { id: '12', name: 'Head & Shoulders', logo: '🧴', description: 'Dandruff-free hair care' },
  { id: '13', name: 'Sunsilk', logo: '🧴', description: 'Smooth and shiny hair' },
  { id: '14', name: 'Pantene', logo: '🧴', description: 'Hair nourishment solutions' }
];

export const sampleCategories = [
  {
    id: '1',
    name: 'Biscuits & Cookies',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    subcategories: ['Glucose', 'Cream', 'Digestive', 'Premium']
  },
  {
    id: '2',
    name: 'Namkeen & Snacks',
    image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
    subcategories: ['Bhujia', 'Mixtures', 'Nuts', 'Chips']
  },
  {
    id: '3',
    name: 'Paan Masala / Mouth Freshener',
    image: 'https://images.pexels.com/photos/4198950/pexels-photo-4198950.jpeg',
    subcategories: ['Premium', 'Regular', 'Sugar Free', 'Mouth Freshener']
  },
  {
    id: '4',
    name: 'Soap / Personal Wash',
    image: 'https://images.pexels.com/photos/4239140/pexels-photo-4239140.jpeg',
    subcategories: ['Antibacterial', 'Moisturizing', 'Fragrance', 'Medicated']
  },
  {
    id: '5',
    name: 'Shampoo / Hair Care',
    image: 'https://images.pexels.com/photos/4466167/pexels-photo-4466167.jpeg',
    subcategories: ['Anti-Dandruff', 'Nourishing', 'Volumizing', 'Color Protection']
  }
];