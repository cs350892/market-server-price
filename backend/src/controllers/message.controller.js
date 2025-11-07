import createHttpError from 'http-errors';
import Message from '../models/message.model.js';

// Get all messages
export const getAllMessages = async (req, res, next) => {
  try {
    const { status, category, priority, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    const skip = (page - 1) * limit;
    
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('fromUser', 'name email phone')
      .populate('relatedOrder', 'invoiceId totalAmount')
      .populate('relatedProduct', 'name image')
      .populate('assignedTo', 'name email')
      .populate('replies.replyBy', 'name email');
    
    const totalMessages = await Message.countDocuments(filter);
    
    res.json({
      success: true,
      count: messages.length,
      totalMessages,
      page: parseInt(page),
      totalPages: Math.ceil(totalMessages / limit),
      messages,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single message
export const getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('fromUser', 'name email phone')
      .populate('relatedOrder')
      .populate('relatedProduct')
      .populate('assignedTo', 'name email')
      .populate('replies.replyBy', 'name email')
      .populate('resolvedBy', 'name email');
    
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    // Mark as read if unread
    if (message.status === 'unread') {
      message.status = 'read';
      message.readAt = new Date();
      await message.save();
    }
    
    res.json({ success: true, message });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create new message (from user or admin)
export const createMessage = async (req, res, next) => {
  try {
    const {
      from,
      subject,
      message,
      category,
      priority,
      relatedOrder,
      relatedProduct,
    } = req.body;
    
    const newMessage = new Message({
      from,
      fromUser: req.user ? req.user.id : null,
      subject,
      message,
      category,
      priority,
      relatedOrder,
      relatedProduct,
    });
    
    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Reply to message
export const replyToMessage = async (req, res, next) => {
  try {
    const { replyText } = req.body;
    
    const message = await Message.findById(req.params.id);
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    message.replies.push({
      replyBy: req.user.id,
      replyText,
      repliedAt: new Date(),
    });
    
    message.status = 'replied';
    await message.save();
    
    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: message,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Update message status
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user.id;
    }
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    res.json({
      success: true,
      message: 'Message status updated',
      data: message,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Assign message to admin
export const assignMessage = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    );
    
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    res.json({
      success: true,
      message: 'Message assigned successfully',
      data: message,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Update message priority
export const updateMessagePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );
    
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    res.json({
      success: true,
      message: 'Message priority updated',
      data: message,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) return next(createHttpError(404, 'Message not found'));
    
    await message.deleteOne();
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get message statistics
export const getMessageStats = async (req, res, next) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const readMessages = await Message.countDocuments({ status: 'read' });
    const repliedMessages = await Message.countDocuments({ status: 'replied' });
    const resolvedMessages = await Message.countDocuments({ status: 'resolved' });
    
    const highPriorityMessages = await Message.countDocuments({
      priority: { $in: ['high', 'urgent'] },
      status: { $nin: ['resolved', 'closed'] }
    });
    
    const messagesByCategory = await Message.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.json({
      success: true,
      stats: {
        totalMessages,
        unreadMessages,
        readMessages,
        repliedMessages,
        resolvedMessages,
        highPriorityMessages,
        messagesByCategory,
      },
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get user's messages
export const getUserMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ fromUser: req.user.id })
      .sort({ createdAt: -1 })
      .populate('relatedOrder', 'invoiceId totalAmount')
      .populate('relatedProduct', 'name image')
      .populate('replies.replyBy', 'name');
    
    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
