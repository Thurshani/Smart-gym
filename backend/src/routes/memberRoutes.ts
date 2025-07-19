import { Router } from 'express';
import {
  getSubscriptionPlans,
  purchaseSubscription,
  checkInToGym,
  getMemberDashboard,
  getVisitHistory
} from '../controllers/memberController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// All member routes require authentication and member role
router.use(authenticateToken, authorizeRoles('member'));

router.get('/subscription-plans', getSubscriptionPlans);
router.post('/purchase-subscription', purchaseSubscription);
router.post('/check-in', checkInToGym);
router.get('/dashboard', getMemberDashboard);
router.get('/visit-history', getVisitHistory);

export default router; 