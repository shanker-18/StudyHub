import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  registerUser, 
  getCurrentUser, 
  updateUserProfile 
} from '../controllers/authController.js';

const router = express.Router();

// Register new user (after Firebase auth)
router.post('/register', authenticateToken, registerUser);

// Get current user profile
router.get('/me', authenticateToken, getCurrentUser);

// Update user profile
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
