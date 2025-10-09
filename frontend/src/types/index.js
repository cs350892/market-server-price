/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier for the product
 * @property {string} name - Name of the product
 * @property {string} image - URL or path to the product image
 * @property {number} mrp - Maximum retail price
 * @property {PricingTier[]} pricingTiers - Array of pricing tiers based on quantity
 * @property {string} description - Product description
 * @property {PackSize[]} packSizes - Available pack sizes for the product
 * @property {string} category - Product category
 * @property {string} brand - Product brand
 * @property {number} stock - Available stock quantity
 */

/**
 * @typedef {Object} PricingTier
 * @property {string} range - Quantity range (e.g., "1-10")
 * @property {number} minQuantity - Minimum quantity for this tier
 * @property {number|null} maxQuantity - Maximum quantity for this tier (null for unlimited)
 * @property {number} price - Price per unit in this tier
 * @property {number} margin - Profit margin percentage
 */

/**
 * @typedef {Object} PackSize
 * @property {string} id - Unique identifier for the pack size
 * @property {string} name - Name of the pack size (e.g., "Single Pack")
 * @property {number} multiplier - Multiplier for quantity calculations
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId - ID of the product
 * @property {Product} product - Product details
 * @property {PackSize} packSize - Selected pack size
 * @property {number} quantity - Quantity in the cart
 */

/**
 * @typedef {Object} Address
 * @property {string} id - Unique identifier for the address
 * @property {string} name - Name associated with the address
 * @property {string} address - Street address
 * @property {string} city - City name
 * @property {string} pincode - Postal code
 * @property {string} phone - Contact phone number
 */

/**
 * @typedef {Object} Brand
 * @property {string} id - Unique identifier for the brand
 * @property {string} name - Brand name
 * @property {string} logo - URL or path to the brand logo
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Category name
 * @property {string} image - URL or path to the category image
 * @property {string[]} subcategories - Array of subcategory names
 */