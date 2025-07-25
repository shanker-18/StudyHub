import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { 
  getAllUsers, 
  getUserById, 
  searchUsers,
  updateUserProfile,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Get all users (with optional filters)
router.get('/', optionalAuth, getAllUsers);

// Search users
router.get('/search', optionalAuth, searchUsers);

// Get user by ID
router.get('/:id', optionalAuth, getUserById);

// Update user profile (authenticated user only)
router.put('/:id', authenticateToken, updateUserProfile);

// Delete user account
router.delete('/:id', authenticateToken, deleteUser);

export default router;
