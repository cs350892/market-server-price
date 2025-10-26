const Product = require('../models/product.model');

// Get all products (for users or admin)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID (for users to view details)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Update product (including dynamic pricing tiers)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculate dynamic price (for frontend real-time updates)
exports.calculatePrice = async (req, res) => {
  try {
    const { productId, packSizeId, quantity } = req.body;
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const packSize = product.packSizes.find(p => p.id === packSizeId);
    if (!packSize) return res.status(400).json({ error: 'Invalid pack size' });

    const totalUnits = quantity * packSize.multiplier;

    // Find applicable tier
    let tier = product.pricingTiers.find(t => {
      if (t.maxQuantity === null) return totalUnits >= t.minQuantity;
      return totalUnits >= t.minQuantity && totalUnits <= t.maxQuantity;
    });

    if (!tier) tier = product.pricingTiers[0]; // Fallback to first tier

    const pricePerUnit = tier.price;
    const totalPrice = pricePerUnit * totalUnits;
    const savingsPercentage = ((product.mrp - pricePerUnit) / product.mrp) * 100;

    // Check stock
    const inStock = product.stock >= totalUnits;

    res.json({
      totalUnits,
      tier: tier.range,
      pricePerUnit,
      totalPrice: totalPrice.toFixed(2),
      savingsPercentage: savingsPercentage.toFixed(2),
      inStock,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};