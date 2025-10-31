import express from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import authMW from '../middleware/authMiddleware.js';

const { verifyToken, isAdmin } = authMW;
const router = express.Router();

router.get('/analytics', verifyToken, isAdmin, getDashboardAnalytics);

export default router;
