import { Router } from 'express';
import {
  getGymDashboard,
  getVisitReports,
  getTodayVisits
} from '../controllers/gymController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// All gym routes require authentication and gym role
router.use(authenticateToken, authorizeRoles('gym'));

router.get('/dashboard', getGymDashboard);
router.get('/reports', getVisitReports);
router.get('/today-visits', getTodayVisits);

export default router; 