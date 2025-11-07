import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  // Minimum purchase amount to apply this offer
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Maximum discount amount (cap for percentage discounts)
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  // If empty array, offer applies to all products
  // If contains product IDs, offer only applies to those products
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  },
  expiry: {
    type: Date,
    required: true,
  },
  // null means unlimited usage
  usageLimit: {
    type: Number,
    default: null,
    min: 0,
  },
  // Tracks how many times the offer has been used
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { 
  timestamps: true 
});

// Indexes for better query performance
offerSchema.index({ code: 1 });
offerSchema.index({ status: 1, expiry: -1 });
offerSchema.index({ createdBy: 1 });
offerSchema.index({ usageCount: -1 });

// Pre-save middleware to check and update expiry status
offerSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.expiry < now && this.status !== 'expired') {
    this.status = 'expired';
  }
  
  // Validate percentage discount
  if (this.discountType === 'percentage' && this.discount > 100) {
    return next(new Error('Percentage discount cannot exceed 100%'));
  }
  
  next();
});

// Method to check if offer is still valid
offerSchema.methods.isValid = function() {
  const now = new Date();
  
  if (this.status !== 'active') return false;
  if (this.expiry < now) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  
  return true;
};

// Method to calculate discount amount
offerSchema.methods.calculateDiscount = function(amount) {
  let discountAmount = 0;
  
  if (this.discountType === 'percentage') {
    discountAmount = (amount * this.discount) / 100;
  } else {
    discountAmount = this.discount;
  }
  
  // Apply maximum discount cap if exists
  if (this.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
  }
  
  return Math.round(discountAmount * 100) / 100;
};

// Static method to get applicable offers for a given amount
offerSchema.statics.getApplicableOffers = async function(amount, productIds = []) {
  const now = new Date();
  
  const query = {
    status: 'active',
    expiry: { $gte: now },
    minPurchaseAmount: { $lte: amount },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ['$usageCount', '$usageLimit'] } }
    ]
  };
  
  // If product IDs provided, include product-specific offers
  if (productIds.length > 0) {
    query.$or = [
      { products: { $size: 0 } }, // General offers
      { products: { $in: productIds } } // Product-specific offers
    ];
  } else {
    query.products = { $size: 0 }; // Only general offers
  }
  
  return await this.find(query)
    .sort({ discount: -1 })
    .populate('products', 'name image');
};

// Virtual for checking if offer is expired
offerSchema.virtual('isExpired').get(function() {
  return this.expiry < new Date() || this.status === 'expired';
});

// Virtual for checking usage percentage
offerSchema.virtual('usagePercentage').get(function() {
  if (!this.usageLimit) return 0;
  return Math.round((this.usageCount / this.usageLimit) * 100);
});

// Ensure virtuals are included in JSON
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Offer', offerSchema);

/**
 * Offer Model Documentation
 * 
 * Purchase Amount Based Discounts (Admin configurable):
 * - ₹10,000+ → 5% discount
 * - ₹5,000+ → 2.5% discount
 * - ₹1,000+ → 0.5% discount
 * 
 * Features:
 * 1. Percentage or Fixed discount types
 * 2. Minimum purchase amount requirement
 * 3. Maximum discount cap
 * 4. Product-specific or general offers
 * 5. Usage limit tracking
 * 6. Automatic expiry status updates
 * 7. Admin-only creation and management
 */
