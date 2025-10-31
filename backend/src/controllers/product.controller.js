import Product from '../models/product.model.js';
import createHttpError from 'http-errors';

// Get all products (for users or admin)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single product by ID (for users to view details)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return next(createHttpError(404, 'Product not found'));
    res.json(product);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Admin: Create new product
export const createProduct = async (req, res, next) => {
  try {
    // Debugging logs: show incoming body and saved document
    console.log('[createProduct] req.body:', JSON.stringify(req.body));
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    console.log('[createProduct] saved:', JSON.stringify(saved));
    res.status(201).json(saved);
  } catch (err) {
    console.error('[createProduct] error:', err);
    next(createHttpError(400, err.message));
  }
};

// Admin: Update product (including dynamic pricing tiers)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return next(createHttpError(404, 'Product not found'));
    res.json(product);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Admin: Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return next(createHttpError(404, 'Product not found'));
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Calculate dynamic price (for frontend real-time updates)
export const calculatePrice = async (req, res, next) => {
  try {
    const { productId, packSizeId, quantity } = req.body;
    if (!productId || !packSizeId || !quantity) {
      return next(createHttpError(400, 'productId, packSizeId and quantity are required'));
    }
    const product = await Product.findOne({ id: productId });
    if (!product) return next(createHttpError(404, 'Product not found'));

    const packSize = product.packSizes.find((p) => p.id === packSizeId);
    if (!packSize) return next(createHttpError(400, 'Invalid pack size'));

    const totalUnits = quantity * packSize.multiplier;

    // Find applicable tier
    let tier = product.pricingTiers.find((t) => {
      if (t.maxQuantity === null) return totalUnits >= t.minQuantity;
      return totalUnits >= t.minQuantity && totalUnits <= t.maxQuantity;
    });

    if (!tier) tier = product.pricingTiers[0]; // Fallback to first tier

    const pricePerUnit = tier.price;
    const totalPrice = pricePerUnit * totalUnits;
    const savingsPercentage = product.mrp ? ((product.mrp - pricePerUnit) / product.mrp) * 100 : 0;

    // Check stock
    const inStock = product.stock >= totalUnits;

    res.json({
      totalUnits,
      tier: tier.range,
      pricePerUnit,
      totalPrice: Number(totalPrice.toFixed(2)),
      savingsPercentage: Number(savingsPercentage.toFixed(2)),
      inStock,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};