import { Router } from 'express';
import { login, registerMember, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register-member', registerMember);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router; 