import createHttpError from 'http-errors';
import Category from '../models/category.model.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = isActive !== undefined ? { isActive: isActive === 'true' } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single category
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createHttpError(404, 'Category not found'));
    res.json({ success: true, category });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Create category (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(createHttpError(409, 'Category already exists'));
    }

    const category = new Category({ name, description, image, isActive });
    await category.save();
    
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) return next(createHttpError(404, 'Category not found'));
    res.json({ success: true, message: 'Category updated', category });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(createHttpError(404, 'Category not found'));
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
