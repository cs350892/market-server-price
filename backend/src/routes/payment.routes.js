import express from 'express';
import { body } from 'express-validator';
import * as paymentController from '../controllers/payment.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Initiate payment (User must be logged in)
router.post('/initiate', verifyToken, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('userPhone').notEmpty().withMessage('User phone is required'),
], validateRequest, paymentController.initiatePayment);

// Payment callback from PhonePe (Public endpoint)
router.post('/callback', paymentController.paymentCallback);

// Check payment status (User must be logged in)
router.get('/status/:transactionId', verifyToken, paymentController.checkPaymentStatus);

// Refund payment (Admin only)
router.post('/refund', verifyToken, isAdmin, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
], validateRequest, paymentController.refundPayment);

export default router;
