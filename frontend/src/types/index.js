// Enum-like constant for CustomerTier
export const CustomerTier = {
  CONSUMER: 'consumer',
  RETAILER: 'retailer',
  WHOLESALER: 'wholesaler'
};

// Sample data structures for documentation
export const PricingTier = {
  // Example: { price: 100, margin: 20 }
};

export const PackagingInfo = {
  // Example: { unitsPerBox: 12, boxesPerPack: 10, minBoxes: 1, maxBoxes: 100 }
};

export const Product = {
  // Example: {
  //   id: '1',
  //   name: 'Blue Heaven Kajal',
  //   image: 'https://example.com/image.jpg',
  //   mrp: 35,
  //   pricingTiers: {
  //     [CustomerTier.CONSUMER]: { price: 30, margin: 14.29 },
  //     [CustomerTier.RETAILER]: { price: 25, margin: 28.57 },
  //     [CustomerTier.WHOLESALER]: { price: 20, margin: 42.86 }
  //   },
  //   stock: 100,
  //   category: 'Cosmetics',
  //   brand: 'Blue Heaven',
  //   description: 'Long-lasting kajal',
  //   features: ['Waterproof', 'Smudge-proof'],
  //   deliveryDays: '2-3 days',
  //   packaging: { unitsPerBox: 12, boxesPerPack: 10, minBoxes: 1, maxBoxes: 100 }
  // }
};

export const CartItem = {
  // Example: {
  //   productId: '1',
  //   name: 'Blue Heaven Kajal',
  //   image: 'https://example.com/image.jpg',
  //   quantity: 10,
  //   price: 30,
  //   tier: CustomerTier.CONSUMER,
  //   mrp: 35,
  //   purchaseMode: 'units',
  //   displayQuantity: '10 units'
  // }
};

export const Address = {
  // Example: {
  //   id: '1',
  //   name: 'Home',
  //   addressLine: '123 Main Street, Apartment 4B',
  //   city: 'Mumbai',
  //   state: 'Maharashtra',
  //   pincode: '400001',
  //   phone: '+91 98765 43210',
  //   isDefault: true
  // }
};

export const Order = {
  // Example: {
  //   id: '1',
  //   userId: '1',
  //   items: [CartItem],
  //   total: 300,
  //   address: Address,
  //   status: 'delivered',
  //   createdAt: '2024-01-15T10:30:00Z',
  //   deliveryDate: '2024-01-17T14:00:00Z'
  // }
};

export const Brand = {
  // Example: {
  //   id: '1',
  //   name: 'Blue Heaven',
  //   logo: 'https://example.com/logo.jpg',
  //   description: 'Quality cosmetics brand'
  // }
};

export const Category = {
  // Example: {
  //   id: '1',
  //   name: 'Cosmetics',
  //   image: 'https://example.com/category.jpg',
  //   subcategories: ['Kajal', 'Lipstick']
  // }
};