import express from 'express';
import { getDashboardAnalytics, getDashboardStats, getLast7DaysSales } from '../controllers/analytics.controller.js';
import * as brandController from '../controllers/brand.controller.js';
import * as categoryController from '../controllers/category.controller.js';
import * as productController from '../controllers/product.controller.js';
import * as orderController from '../controllers/order.controller.js';
import * as userController from '../controllers/user.controller.js';
import * as payoutController from '../controllers/payout.controller.js';
import * as offerController from '../controllers/offer.controller.js';
import * as messageController from '../controllers/message.controller.js';
import authMW from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

// Analytics & Dashboard
router.get('/analytics', getDashboardAnalytics);
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/sales/last7days', getLast7DaysSales);

// Brand Management
router.get('/brands', brandController.getAllBrands);
router.post('/brands', [
  body('name').notEmpty().withMessage('Brand name is required'),
], validateRequest, brandController.createBrand);
router.put('/brands/:id', brandController.updateBrand);
router.delete('/brands/:id', brandController.deleteBrand);

// Category Management
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', [
  body('name').notEmpty().withMessage('Category name is required'),
], validateRequest, categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Product Management
router.get('/products', productController.getAllProducts);
router.post('/products', [
  body('id').notEmpty().withMessage('Product id is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('mrp').isNumeric().withMessage('MRP must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
], validateRequest, productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Order Management
router.get('/orders', orderController.getAllOrders);
router.get('/orders/stats', orderController.getOrderStats);
router.put('/orders/:id/status', orderController.updateOrderStatus);

// User Management
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Payout Management
router.get('/payouts', payoutController.getAllPayouts);
router.get('/payouts/stats', payoutController.getPayoutStats);
router.get('/payouts/:id', payoutController.getPayoutById);
router.post('/payouts', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('orderIds').isArray().withMessage('Order IDs must be an array'),
], validateRequest, payoutController.createPayout);
router.put('/payouts/:id/status', payoutController.updatePayoutStatus);
router.delete('/payouts/:id', payoutController.deletePayout);

// Offer/Coupon Management
router.get('/offers', offerController.getAllOffers);
router.get('/offers/active', offerController.getActiveOffers);
router.get('/offers/stats', offerController.getOfferStats);
router.get('/offers/:id', offerController.getOfferById);
router.post('/offers', [
  body('code').notEmpty().withMessage('Offer code is required'),
  body('discount').isNumeric().withMessage('Discount must be a number'),
  body('expiry').isISO8601().withMessage('Valid expiry date is required'),
], validateRequest, offerController.createOffer);
router.put('/offers/:id', offerController.updateOffer);
router.delete('/offers/:id', offerController.deleteOffer);

// Message/Support Management
router.get('/messages', messageController.getAllMessages);
router.get('/messages/stats', messageController.getMessageStats);
router.get('/messages/:id', messageController.getMessageById);
router.post('/messages', [
  body('from').notEmpty().withMessage('From field is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
], validateRequest, messageController.createMessage);
router.post('/messages/:id/reply', [
  body('replyText').notEmpty().withMessage('Reply text is required'),
], validateRequest, messageController.replyToMessage);
router.put('/messages/:id/status', messageController.updateMessageStatus);
router.put('/messages/:id/assign', messageController.assignMessage);
router.put('/messages/:id/priority', messageController.updateMessagePriority);
router.delete('/messages/:id', messageController.deleteMessage);

export default router;
