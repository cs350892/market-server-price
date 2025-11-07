import express from 'express';
import { body } from 'express-validator';
import * as categoryController from '../controllers/category.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', verifyToken, isAdmin, [
  body('name').notEmpty().withMessage('Category name is required'),
], validateRequest, categoryController.createCategory);

router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

export default router;
