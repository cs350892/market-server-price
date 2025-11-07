import createHttpError from 'http-errors';
import Brand from '../models/brand.model.js';

// Get all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = isActive !== undefined ? { isActive: isActive === 'true' } : {};
    const brands = await Brand.find(filter).sort({ name: 1 });
    res.json({ success: true, count: brands.length, brands });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single brand
export const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(createHttpError(404, 'Brand not found'));
    res.json({ success: true, brand });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create brand (Admin only)
export const createBrand = async (req, res, next) => {
  try {
    const { name, description, logo, isActive } = req.body;
    
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return next(createHttpError(409, 'Brand already exists'));
    }

    const brand = new Brand({ name, description, logo, isActive });
    await brand.save();
    
    res.status(201).json({ success: true, message: 'Brand created', brand });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Update brand (Admin only)
export const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!brand) return next(createHttpError(404, 'Brand not found'));
    res.json({ success: true, message: 'Brand updated', brand });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete brand (Admin only)
export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return next(createHttpError(404, 'Brand not found'));
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
