import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: String,
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
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
  usageLimit: {
    type: Number,
    default: null, // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Indexes
offerSchema.index({ code: 1 });
offerSchema.index({ status: 1, expiry: -1 });

// Pre-save middleware to check expiry
offerSchema.pre('save', function(next) {
  if (this.expiry < Date.now() && this.status !== 'expired') {
    this.status = 'expired';
  }
  next();
});

export default mongoose.model('Offer', offerSchema);
