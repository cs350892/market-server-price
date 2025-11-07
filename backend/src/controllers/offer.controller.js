import createHttpError from 'http-errors';
import Offer from '../models/offer.model.js';

// Get all offers
export const getAllOffers = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = status ? { status } : {};
    
    const skip = (page - 1) * limit;
    
    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('products', 'name image')
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

// Get active offers
export const getActiveOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({
      status: 'active',
      expiry: { $gte: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate('products', 'name image');
    
    res.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single offer
export const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('products', 'name image mrp')
      .populate('createdBy', 'name email');
    
    if (!offer) return next(createHttpError(404, 'Offer not found'));
    
    res.json({ success: true, offer });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create new offer
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
    } = req.body;
    
    // Check if offer code already exists
    const existingOffer = await Offer.findOne({ code: code.toUpperCase() });
    if (existingOffer) {
      return next(createHttpError(400, 'Offer code already exists'));
    }
    
    const offer = new Offer({
      code: code.toUpperCase(),
      description,
      discount,
      discountType,
      products,
      expiry,
      usageLimit,
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

// Update offer
export const updateOffer = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!offer) return next(createHttpError(404, 'Offer not found'));
    
    res.json({
      success: true,
      message: 'Offer updated successfully',
      offer,
    });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete offer
export const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) return next(createHttpError(404, 'Offer not found'));
    
    await offer.deleteOne();
    
    res.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get offer statistics
export const getOfferStats = async (req, res, next) => {
  try {
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ 
      status: 'active', 
      expiry: { $gte: new Date() } 
    });
    const expiredOffers = await Offer.countDocuments({ 
      expiry: { $lt: new Date() } 
    });
    
    const mostUsedOffers = await Offer.find()
      .sort({ usageCount: -1 })
      .limit(5)
      .select('code discount usageCount');
    
    res.json({
      success: true,
      stats: {
        totalOffers,
        activeOffers,
        expiredOffers,
        mostUsedOffers,
      },
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
