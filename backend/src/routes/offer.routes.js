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
// Place specific static routes before parameterized routes to avoid conflicts
router.get('/stats', authenticate, checkAdminRole, getOfferStats);
router.get('/:id/usage', authenticate, checkAdminRole, getOfferUsageDetails);
router.patch('/bulk-status', authenticate, checkAdminRole, bulkUpdateStatus);

// Standard RESTful endpoints required by the project
// GET /api/offers        -> get all offers (admin-protected)
// GET /api/offers/:id    -> get single offer (admin-protected)
// POST /api/offers       -> create new offer (admin-protected)
// PUT /api/offers/:id    -> update offer (admin-protected)
// DELETE /api/offers/:id -> delete offer (admin-protected)

router.get('/', authenticate, checkAdminRole, getAllOffers);
router.get('/:id', authenticate, checkAdminRole, getOfferById);
router.post('/', authenticate, checkAdminRole, createOffer);
router.put('/:id', authenticate, checkAdminRole, updateOffer);
router.delete('/:id', authenticate, checkAdminRole, deleteOffer);

// Backwards-compatible endpoints (keep existing named routes)
router.get('/all', authenticate, checkAdminRole, getAllOffers);
router.post('/create', authenticate, checkAdminRole, createOffer);

export default router;