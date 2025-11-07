import createHttpError from 'http-errors';
import Payout from '../models/payout.model.js';
import Order from '../models/order.model.js';

// Get all payouts
export const getAllPayouts = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = status ? { status } : {};
    
    const skip = (page - 1) * limit;
    
    const payouts = await Payout.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('orders', 'invoiceId totalAmount status createdAt')
      .populate('processedBy', 'name email');
    
    const totalPayouts = await Payout.countDocuments(filter);
    
    res.json({
      success: true,
      count: payouts.length,
      totalPayouts,
      page: parseInt(page),
      totalPages: Math.ceil(totalPayouts / limit),
      payouts,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single payout
export const getPayoutById = async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id)
      .populate('orders')
      .populate('processedBy', 'name email');
    
    if (!payout) return next(createHttpError(404, 'Payout not found'));
    
    res.json({ success: true, payout });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create new payout
export const createPayout = async (req, res, next) => {
  try {
    const { date, amount, orderIds, paymentMethod, bankDetails, notes } = req.body;
    
    if (!orderIds || orderIds.length === 0) {
      return next(createHttpError(400, 'Payout must include at least one order'));
    }
    
    // Verify orders exist
    const orders = await Order.find({ _id: { $in: orderIds } });
    if (orders.length !== orderIds.length) {
      return next(createHttpError(404, 'Some orders not found'));
    }
    
    // Get invoice IDs
    const invoiceIds = orders.map(order => order.invoiceId);
    
    const payout = new Payout({
      date,
      amount,
      orders: orderIds,
      invoiceIds,
      paymentMethod,
      bankDetails,
      notes,
      processedBy: req.user.id,
    });
    
    await payout.save();
    
    res.status(201).json({
      success: true,
      message: 'Payout created successfully',
      payout,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Update payout status
export const updatePayoutStatus = async (req, res, next) => {
  try {
    const { status, transactionId } = req.body;
    
    const updateData = { status };
    if (transactionId) updateData.transactionId = transactionId;
    if (status === 'completed') {
      updateData.processedAt = Date.now();
      updateData.processedBy = req.user.id;
    }
    
    const payout = await Payout.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!payout) return next(createHttpError(404, 'Payout not found'));
    
    res.json({
      success: true,
      message: 'Payout status updated',
      payout,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete payout
export const deletePayout = async (req, res, next) => {
  try {
    const payout = await Payout.findById(req.params.id);
    
    if (!payout) return next(createHttpError(404, 'Payout not found'));
    
    // Only allow deletion if status is pending
    if (payout.status !== 'pending') {
      return next(createHttpError(400, 'Cannot delete payout that is not pending'));
    }
    
    await payout.deleteOne();
    
    res.json({
      success: true,
      message: 'Payout deleted successfully',
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get payout statistics
export const getPayoutStats = async (req, res, next) => {
  try {
    const totalPayouts = await Payout.countDocuments();
    const pendingPayouts = await Payout.countDocuments({ status: 'pending' });
    const completedPayouts = await Payout.countDocuments({ status: 'completed' });
    
    const totalAmountAgg = await Payout.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    
    const totalPaidAmount = totalAmountAgg[0]?.totalAmount || 0;
    
    const pendingAmountAgg = await Payout.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, pendingAmount: { $sum: '$amount' } } },
    ]);
    
    const totalPendingAmount = pendingAmountAgg[0]?.pendingAmount || 0;
    
    res.json({
      success: true,
      stats: {
        totalPayouts,
        pendingPayouts,
        completedPayouts,
        totalPaidAmount,
        totalPendingAmount,
      },
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
