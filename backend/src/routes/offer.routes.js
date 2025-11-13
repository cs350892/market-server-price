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
import { authenticate } from '../middleware/auth.middleware.js'; // existing auth middleware

const router = express.Router();

// Public routes (no authentication required)
router.get('/active', getActiveOffers);
router.get('/code/:code', getOfferByCode);
router.post('/validate', validateOffer);

// Admin-only / protected routes
// IMPORTANT: Place ALL specific static routes BEFORE parameterized routes to avoid conflicts
router.get('/stats', authenticate, checkAdminRole, getOfferStats);
router.get('/all', authenticate, checkAdminRole, getAllOffers);
router.post('/create', authenticate, checkAdminRole, createOffer);
router.patch('/bulk-status', authenticate, checkAdminRole, bulkUpdateStatus);

// Standard RESTful endpoints required by the project
// These use parameterized routes, so they must come AFTER all static routes
router.get('/', authenticate, checkAdminRole, getAllOffers);
router.post('/', authenticate, checkAdminRole, createOffer);

// Parameterized routes - MUST be last
router.get('/:id/usage', authenticate, checkAdminRole, getOfferUsageDetails);
router.get('/:id', authenticate, checkAdminRole, getOfferById);
router.put('/:id', authenticate, checkAdminRole, updateOffer);
router.delete('/:id', authenticate, checkAdminRole, deleteOffer);

export default router;