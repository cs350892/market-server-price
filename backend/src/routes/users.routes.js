import express from 'express';
import * as userController from '../controllers/user.controller.js';
import authMW from '../middleware/authMiddleware.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

// Admin only
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

export default router;
