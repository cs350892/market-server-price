import express from 'express';
import { body } from 'express-validator';
import * as brandController from '../controllers/brand.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Admin only routes
router.post('/', verifyToken, isAdmin, [
  body('name').notEmpty().withMessage('Brand name is required'),
], validateRequest, brandController.createBrand);

router.put('/:id', verifyToken, isAdmin, brandController.updateBrand);
router.delete('/:id', verifyToken, isAdmin, brandController.deleteBrand);

export default router;
