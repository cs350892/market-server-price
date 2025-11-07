import express from 'express';
import {
  getAllOffers,
  getActiveOffers,
  getOfferById,
  getOfferByCode,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferStats,
  getOfferUsageDetails,
  validateOffer,
  bulkUpdateStatus,
  checkAdminRole,
} from '../controllers/offer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js'; //  auth middleware ?

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveOffers);
router.get('/code/:code', getOfferByCode);
router.post('/validate', validateOffer);

// Protected routes (authentication required)
// Admin-only routes
router.get('/all', authenticate, checkAdminRole, getAllOffers);
router.get('/stats', authenticate, checkAdminRole, getOfferStats);
router.get('/:id/usage', authenticate, checkAdminRole, getOfferUsageDetails);
router.get('/:id', authenticate, checkAdminRole, getOfferById);
router.post('/create', authenticate, checkAdminRole, createOffer);
router.put('/:id', authenticate, checkAdminRole, updateOffer);
router.delete('/:id', authenticate, checkAdminRole, deleteOffer);
router.patch('/bulk-status', authenticate, checkAdminRole, bulkUpdateStatus);

export default router;