import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['product_query', 'order_issue', 'payment_issue', 'delivery_issue', 'feedback', 'complaint', 'general'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'resolved', 'closed'],
    default: 'unread',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  replies: [{
    replyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    replyText: {
      type: String,
      required: true,
    },
    repliedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  readAt: Date,
  resolvedAt: Date,
}, { timestamps: true });

// Indexes for faster queries
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ fromUser: 1 });
messageSchema.index({ assignedTo: 1 });
messageSchema.index({ category: 1 });

export default mongoose.model('Message', messageSchema);
