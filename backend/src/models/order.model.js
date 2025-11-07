import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productId: String, // Custom product id
  name: String,
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  packSize: {
    id: String,
    name: String,
    multiplier: Number,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  totalUnits: Number,
  tierRange: String,
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    unique: true,
    sparse: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  
  // Offer/Discount related fields
  offerCode: {
    type: String,
    uppercase: true,
    trim: true,
    default: null,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'none'],
    default: 'none',
  },
  
  // Amount fields
  subtotalAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery',
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  pickupLocation: {
    name: String,
    address: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'upi', 'cash'],
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
}, { timestamps: true });

// Indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ invoiceId: 1 });
orderSchema.index({ offerCode: 1 }); // New index for offer queries
orderSchema.index({ offer: 1 }); // New index for offer reference

// Pre-save middleware to generate invoice ID
orderSchema.pre('save', async function(next) {
  if (!this.invoiceId && this.isNew) {
    const count = await this.constructor.countDocuments();
    const invoiceNumber = String(count + 1).padStart(6, '0');
    this.invoiceId = `INV${invoiceNumber}`;
  }
  next();
});

// Method to calculate final amount after discount
orderSchema.methods.calculateFinalAmount = function() {
  return Math.round((this.subtotalAmount - this.discountAmount) * 100) / 100;
};

// Virtual for checking if order has discount
orderSchema.virtual('hasDiscount').get(function() {
  return this.discountAmount > 0 && this.offerCode;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export default mongoose.model('Order', orderSchema);