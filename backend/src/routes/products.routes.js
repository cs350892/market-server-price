import express from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/product.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
const { verifyToken, isAdmin } = authMW;

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/calculate-price', productController.calculatePrice);

const productValidation = [
	body('id').notEmpty().withMessage('Product id is required'),
	body('name').notEmpty().withMessage('Name is required'),
	body('mrp').isNumeric().withMessage('MRP must be a number'),
	body('category').notEmpty().withMessage('Category is required'),
	body('brand').notEmpty().withMessage('Brand is required'),
	body('stock').isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
];

router.post('/', verifyToken, isAdmin, productValidation, validateRequest, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productValidation, validateRequest, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

export default router;
