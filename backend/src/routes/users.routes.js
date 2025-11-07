import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Protected user routes (user must be logged in)
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
], validateRequest, userController.updateUserProfile);

// Address management routes
router.get('/addresses', verifyToken, userController.getUserAddresses);
router.post('/addresses', verifyToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
], validateRequest, userController.addAddress);
router.put('/addresses/:addressId', verifyToken, userController.updateAddress);
router.delete('/addresses/:addressId', verifyToken, userController.deleteAddress);

// Admin only
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

export default router;
