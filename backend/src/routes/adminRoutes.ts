import { Router } from 'express';
import {
  getAdminDashboard,
  getAllMembers,
  getAllGyms,
  createGym,
  updateMember,
  updateGym,
  deactivateUser,
  getGlobalReports
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/members', getAllMembers);
router.get('/gyms', getAllGyms);
router.post('/gyms', createGym);
router.put('/members/:memberId', updateMember);
router.put('/gyms/:gymId', updateGym);
router.patch('/users/:userId/deactivate', deactivateUser);
router.get('/reports', getGlobalReports);

export default router; 