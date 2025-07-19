import { Router } from 'express';
import authRoutes from './authRoutes.js';
import memberRoutes from './memberRoutes.js';
import gymRoutes from './gymRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/member', memberRoutes);
router.use('/gym', gymRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FitFlow API is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 