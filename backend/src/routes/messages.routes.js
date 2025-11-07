import express from 'express';
import { body } from 'express-validator';
import * as messageController from '../controllers/message.controller.js';
import authMW from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
const { verifyToken, isAdmin } = authMW;

const router = express.Router();

// User routes (authenticated users)
router.get('/user', verifyToken, messageController.getUserMessages);
router.post('/', [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('subject').isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], validateRequest, verifyToken, messageController.createMessage);

// Admin routes (admin only)
router.get('/', verifyToken, isAdmin, messageController.getAllMessages);
router.get('/stats', verifyToken, isAdmin, messageController.getMessageStats);
router.get('/:id', verifyToken, isAdmin, messageController.getMessageById);
router.put('/:id/status', verifyToken, isAdmin, messageController.updateMessageStatus);
router.put('/:id/assign', verifyToken, isAdmin, messageController.assignMessage);
router.put('/:id/priority', verifyToken, isAdmin, messageController.updateMessagePriority);
router.post('/:id/reply', verifyToken, isAdmin, messageController.replyToMessage);
router.delete('/:id', verifyToken, isAdmin, messageController.deleteMessage);

export default router;