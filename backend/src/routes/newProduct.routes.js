import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth2.middleware.js';
import {
  createProduct,
  getAllProducts,
  getAllProductsWithLimits,
  getProductByCategory,
  getProductByCategoryWithLimit,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllCategoryNames,
  getPriceForQuantity,
  searchProducts,
  getProductsByBrand,
  getLowStockProducts,
  getOutOfStockProducts
} from '../controllers/newProduct.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productRouter = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { 
    fileSize: 4 * 1024 * 1024 // Max file size: 4MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'));
    }
  }
});

// ===== PUBLIC ROUTES (No authentication required) =====

// Get all products (basic list)
productRouter.get('/all', getAllProducts);

// Get all products with pagination and stats
productRouter.get('/list', getAllProductsWithLimits);

// Get single product by ID 
productRouter.get('/details/:productId', getSingleProduct);

// Get products by category (with array of categories)
productRouter.post('/by-category', getProductByCategory);

// Get products by category with pagination
productRouter.post('/by-category-limit', getProductByCategoryWithLimit);

// Get all unique category names
productRouter.get('/categories', getAllCategoryNames);

// Get products by brand
productRouter.get('/brand/:brand', getProductsByBrand);

// Search products
productRouter.get('/search', searchProducts);

// Get price for specific quantity
productRouter.post('/price/:productId', getPriceForQuantity);

// Get low stock products
productRouter.get('/stock/low', getLowStockProducts);

// Get out of stock products
productRouter.get('/stock/out', getOutOfStockProducts);

// ===== PROTECTED ROUTES (Authentication required) =====

// Create new product (Admin/Manager only)
productRouter.post(
  '/create',
  authenticate,
  upload.fields([{ name: 'productImage', maxCount: 1 }]),
  createProduct
);

// Update product (Admin/Manager only)
productRouter.patch(
  '/update/:productId',
  authenticate,
  upload.fields([{ name: 'productImage', maxCount: 1 }]),
  updateProduct
);

// Delete product (Admin/Manager only)
productRouter.delete(
  '/delete/:productId',
  authenticate,
  deleteProduct
);

export default productRouter;