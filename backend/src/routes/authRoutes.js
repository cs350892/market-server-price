import express from 'express';
import { body } from 'express-validator';
import { register, login, profile } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
], validateRequest, register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
], validateRequest, login);

router.get('/profile', verifyToken, profile);

export default router;
