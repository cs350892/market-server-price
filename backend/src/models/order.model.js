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
    default: 'delivery', // Default to delivery for testing
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    postalCode: String, // Alternative field name
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

// Indexes for faster queries....................
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ invoiceId: 1 });

// Pre-save middleware to generate invoice ID
orderSchema.pre('save', async function(next) {
  if (!this.invoiceId && this.isNew) {
    const count = await this.constructor.countDocuments();
    const invoiceNumber = String(count + 1).padStart(6, '0');
    this.invoiceId = `INV${invoiceNumber}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);