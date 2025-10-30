import { Schema, model } from 'mongoose';

// Quantity-based pricing sub-schema (without customer type)
const quantityPricingSchema = new Schema({
  minQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  maxQuantity: {
    type: Number,
    default: null // null means no upper limit
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { _id: false });

// Pack size sub-schema
const packSizeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
    // Examples: "Pack of 2", "200ml", "400ml", "1 ltr"
  },
  multiplier: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  }
}, { _id: false });

// Main Product Schema
const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  productImage:{
    type: String,
    
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  category: {
    type: [String],
    required: [true, 'At least one category is required'],
    
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  hsnNumber: {
    type: Number,
    required: [true, 'HSN number is required']
  },
  gstPercentage: {
    type: Number,
    required: [true, 'GST percentage is required'],
    min: [0, 'GST cannot be negative'],
    max: [100, 'GST cannot exceed 100%']
  },
  rateAfterGST: {
    type: Number,
    min: [0, 'Rate after GST cannot be negative']
  },
  valueAfterGST: {
    type: Number,
    min: [0, 'Value after GST cannot be negative']
  },
  quantityBasedPricing: {
    type: [quantityPricingSchema],
    default: []
  },
  packSizes: {
    type: [packSizeSchema],
    default: []
  }
}, {
  timestamps: true 
});

// Pre-save middleware to calculate rateAfterGST and valueAfterGST
productSchema.pre('save', function(next) {
  // Calculate rate after GST if not provided
  if (this.isModified('rate') || this.isModified('gstPercentage')) {
    this.rateAfterGST = this.rate + (this.rate * this.gstPercentage / 100);
  }
  
  // Calculate value after GST (rate * quantity) if not provided
  if (this.isModified('rateAfterGST') || this.isModified('stockQuantity')) {
    this.valueAfterGST = this.rateAfterGST * this.stockQuantity;
  }
  
  next();
});

// Instance method to get pricing for specific quantity (customer type removed)
productSchema.methods.getPriceForQuantity = function(quantity) {
  // Find applicable pricing tier
  const applicablePricing = this.quantityBasedPricing
    .filter(pricing => 
      quantity >= pricing.minQuantity &&
      (pricing.maxQuantity === null || quantity <= pricing.maxQuantity)
    )
    .sort((a, b) => b.minQuantity - a.minQuantity)[0]; // Get highest applicable tier

  if (applicablePricing) {
    const discountAmount = this.rate * (applicablePricing.discountPercentage / 100);
    const discountedRate = this.rate - discountAmount;
    const rateAfterGST = discountedRate + (discountedRate * this.gstPercentage / 100);
    
    return {
      originalRate: this.rate,
      discountPercentage: applicablePricing.discountPercentage,
      discountAmount,
      discountedRate,
      gstAmount: discountedRate * this.gstPercentage / 100,
      rateAfterGST,
      totalPrice: rateAfterGST * quantity
    };
  }

  // No applicable pricing, return standard rate
  const gstAmount = this.rate * this.gstPercentage / 100;
  return {
    originalRate: this.rate,
    discountPercentage: 0,
    discountAmount: 0,
    discountedRate: this.rate,
    gstAmount,
    rateAfterGST: this.rateAfterGST,
    totalPrice: this.rateAfterGST * quantity
  };
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

// Indexes for better query performance
productSchema.index({ productName: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ hsnNumber: 1 });

const Product = model('Product', productSchema);

export default Product;