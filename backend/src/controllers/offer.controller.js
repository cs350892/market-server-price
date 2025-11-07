import createHttpError from 'http-errors';
import Offer from '../models/offer.model.js';
import Order from '../models/order.model.js'; // Assuming  Order model

// Middleware to check admin role
export const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(createHttpError(403, 'Access denied. Admin privileges required.'));
};

// Get all offers (with filters and pagination)
export const getAllOffers = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    
    const offers = await Offer.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('products', 'name image mrp price')
      .populate('createdBy', 'name email');
    
    const totalOffers = await Offer.countDocuments(filter);
    
    res.json({
      success: true,
      count: offers.length,
      totalOffers,
      page: parseInt(page),
      totalPages: Math.ceil(totalOffers / limit),
      offers,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get active offers (public - can be accessed by customers)
export const getActiveOffers = async (req, res, next) => {
  try {
    const currentDate = new Date();
    
    const offers = await Offer.find({
      status: 'active',
      expiry: { $gte: currentDate },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usageCount', '$usageLimit'] } }
      ]
    })
      .sort({ discount: -1 })
      .populate('products', 'name image mrp price');
    
    res.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single offer by ID
export const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('products', 'name image mrp price')
      .populate('createdBy', 'name email');
    
    if (!offer) {
      return next(createHttpError(404, 'Offer not found'));
    }
    
    res.json({ 
      success: true, 
      offer 
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get offer by code (for customers to check validity)
export const getOfferByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const currentDate = new Date();
    
    const offer = await Offer.findOne({ 
      code: code.toUpperCase(),
      status: 'active',
      expiry: { $gte: currentDate }
    }).populate('products', 'name image mrp price');
    
    if (!offer) {
      return next(createHttpError(404, 'Invalid or expired offer code'));
    }
    
    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return next(createHttpError(400, 'Offer usage limit reached'));
    }
    
    res.json({ 
      success: true, 
      offer 
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create new offer (Admin only)
export const createOffer = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discount,
      discountType,
      products,
      expiry,
      usageLimit,
      minPurchaseAmount,
      maxDiscountAmount,
    } = req.body;
    
    // Validate required fields
    if (!code || !discount || !expiry) {
      return next(createHttpError(400, 'Code, discount, and expiry date are required'));
    }
    
    // Check if offer code already exists
    const existingOffer = await Offer.findOne({ code: code.toUpperCase() });
    if (existingOffer) {
      return next(createHttpError(400, 'Offer code already exists'));
    }
    
    // Validate discount based on type
    if (discountType === 'percentage' && (discount < 0 || discount > 100)) {
      return next(createHttpError(400, 'Percentage discount must be between 0 and 100'));
    }
    
    if (discountType === 'fixed' && discount < 0) {
      return next(createHttpError(400, 'Fixed discount cannot be negative'));
    }
    
    // Validate expiry date
    if (new Date(expiry) <= new Date()) {
      return next(createHttpError(400, 'Expiry date must be in the future'));
    }
    
    const offer = new Offer({
      code: code.toUpperCase(),
      description,
      discount,
      discountType: discountType || 'percentage',
      products: products || [],
      expiry,
      usageLimit,
      minPurchaseAmount: minPurchaseAmount || 0,
      maxDiscountAmount,
      createdBy: req.user.id,
    });
    
    await offer.save();
    
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Update offer (Admin only)
export const updateOffer = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // Normalize code to uppercase
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      
      // Check if new code already exists (excluding current offer)
      const existingOffer = await Offer.findOne({ 
        code: updateData.code,
        _id: { $ne: req.params.id }
      });
      
      if (existingOffer) {
        return next(createHttpError(400, 'Offer code already exists'));
      }
    }
    
    // Validate discount if being updated
    if (updateData.discount !== undefined) {
      const offer = await Offer.findById(req.params.id);
      const discountType = updateData.discountType || offer.discountType;
      
      if (discountType === 'percentage' && (updateData.discount < 0 || updateData.discount > 100)) {
        return next(createHttpError(400, 'Percentage discount must be between 0 and 100'));
      }
      
      if (discountType === 'fixed' && updateData.discount < 0) {
        return next(createHttpError(400, 'Fixed discount cannot be negative'));
      }
    }
    
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('products', 'name image mrp price')
      .populate('createdBy', 'name email');
    
    if (!offer) {
      return next(createHttpError(404, 'Offer not found'));
    }
    
    res.json({
      success: true,
      message: 'Offer updated successfully',
      offer,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete offer (Admin only)
export const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return next(createHttpError(404, 'Offer not found'));
    }
    
    await offer.deleteOne();
    
    res.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get offer statistics (Admin only)
export const getOfferStats = async (req, res, next) => {
  try {
    const currentDate = new Date();
    
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ 
      status: 'active', 
      expiry: { $gte: currentDate } 
    });
    const expiredOffers = await Offer.countDocuments({ 
      $or: [
        { expiry: { $lt: currentDate } },
        { status: 'expired' }
      ]
    });
    const inactiveOffers = await Offer.countDocuments({ status: 'inactive' });
    
    // Most used offers
    const mostUsedOffers = await Offer.find()
      .sort({ usageCount: -1 })
      .limit(10)
      .select('code description discount discountType usageCount usageLimit');
    
    // Total discount given
    const offers = await Offer.find();
    let totalDiscountGiven = 0;
    
    // You would need to calculate this from actual order data
    // This is a placeholder calculation
    for (const offer of offers) {
      // Assuming you store discount amount in orders
      totalDiscountGiven += offer.usageCount * offer.discount;
    }
    
    res.json({
      success: true,
      stats: {
        totalOffers,
        activeOffers,
        expiredOffers,
        inactiveOffers,
        mostUsedOffers,
        totalDiscountGiven,
      },
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get detailed offer usage statistics (Admin only)
export const getOfferUsageDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const offer = await Offer.findById(id)
      .populate('products', 'name image')
      .populate('createdBy', 'name email');
    
    if (!offer) {
      return next(createHttpError(404, 'Offer not found'));
    }
    
    // Get order usage aggregated by user
    const orderUsage = await Order.aggregate([
      {
        $match: {
          offerCode: offer.code
        }
      },
      {
        $group: {
          _id: '$user',
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: '$discountAmount' },
          totalOrderValue: { $sum: '$totalAmount' },
          totalSubtotal: { $sum: '$subtotalAmount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$userDetails.name',
          userEmail: '$userDetails.email',
          usageCount: 1,
          totalDiscount: 1,
          totalOrderValue: 1,
          totalSubtotal: 1,
          averageDiscount: { 
            $divide: ['$totalDiscount', '$usageCount'] 
          }
        }
      },
      {
        $sort: { usageCount: -1 }
      }
    ]);
    
    // Calculate total statistics
    const totalStats = orderUsage.reduce((acc, user) => {
      acc.totalDiscount += user.totalDiscount;
      acc.totalOrders += user.usageCount;
      acc.totalRevenue += user.totalOrderValue;
      return acc;
    }, { totalDiscount: 0, totalOrders: 0, totalRevenue: 0 });
    
    res.json({
      success: true,
      offer: {
        code: offer.code,
        description: offer.description,
        discount: offer.discount,
        discountType: offer.discountType,
        totalUsageCount: offer.usageCount,
        usageLimit: offer.usageLimit,
        status: offer.status,
        expiry: offer.expiry,
      },
      usageDetails: orderUsage,
      totalUsers: orderUsage.length,
      statistics: {
        totalDiscount: Math.round(totalStats.totalDiscount * 100) / 100,
        totalOrders: totalStats.totalOrders,
        totalRevenue: Math.round(totalStats.totalRevenue * 100) / 100,
        averageOrderValue: orderUsage.length > 0 
          ? Math.round((totalStats.totalRevenue / totalStats.totalOrders) * 100) / 100 
          : 0,
      }
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Validate and apply offer to cart (can be used by customers)
export const validateOffer = async (req, res, next) => {
  try {
    const { code, cartItems, totalAmount } = req.body;
    
    if (!code || !cartItems || totalAmount === undefined) {
      return next(createHttpError(400, 'Code, cart items, and total amount are required'));
    }
    
    const currentDate = new Date();
    const offer = await Offer.findOne({ 
      code: code.toUpperCase(),
      status: 'active',
      expiry: { $gte: currentDate }
    }).populate('products', '_id');
    
    if (!offer) {
      return next(createHttpError(404, 'Invalid or expired offer code'));
    }
    
    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return next(createHttpError(400, 'Offer usage limit reached'));
    }
    
    // Check minimum purchase amount
    if (offer.minPurchaseAmount && totalAmount < offer.minPurchaseAmount) {
      return next(createHttpError(400, `Minimum purchase amount of ₹${offer.minPurchaseAmount} required`));
    }
    
    // Check if offer is product-specific
    if (offer.products && offer.products.length > 0) {
      const offerProductIds = offer.products.map(p => p._id.toString());
      const cartProductIds = cartItems.map(item => item.productId.toString());
      
      const hasEligibleProduct = cartProductIds.some(id => offerProductIds.includes(id));
      
      if (!hasEligibleProduct) {
        return next(createHttpError(400, 'This offer is not applicable to items in your cart'));
      }
      
      // Calculate discount only on eligible products
      let eligibleAmount = 0;
      cartItems.forEach(item => {
        if (offerProductIds.includes(item.productId.toString())) {
          eligibleAmount += item.price * item.quantity;
        }
      });
      
      let discountAmount = 0;
      if (offer.discountType === 'percentage') {
        discountAmount = (eligibleAmount * offer.discount) / 100;
      } else {
        discountAmount = offer.discount;
      }
      
      // Apply max discount cap if exists
      if (offer.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, offer.maxDiscountAmount);
      }
      
      return res.json({
        success: true,
        valid: true,
        offer: {
          code: offer.code,
          description: offer.description,
          discount: offer.discount,
          discountType: offer.discountType,
        },
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalAmount: Math.round((totalAmount - discountAmount) * 100) / 100,
      });
    }
    
    // General offer - apply to entire cart
    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = (totalAmount * offer.discount) / 100;
    } else {
      discountAmount = offer.discount;
    }
    
    // Apply max discount cap if exists
    if (offer.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, offer.maxDiscountAmount);
    }
    
    res.json({
      success: true,
      valid: true,
      offer: {
        code: offer.code,
        description: offer.description,
        discount: offer.discount,
        discountType: offer.discountType,
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round((totalAmount - discountAmount) * 100) / 100,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Bulk update offer status (Admin only)
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { offerIds, status } = req.body;
    
    if (!offerIds || !Array.isArray(offerIds) || offerIds.length === 0) {
      return next(createHttpError(400, 'Offer IDs array is required'));
    }
    
    if (!['active', 'inactive', 'expired'].includes(status)) {
      return next(createHttpError(400, 'Invalid status value'));
    }
    
    const result = await Offer.updateMany(
      { _id: { $in: offerIds } },
      { status }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} offers updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};