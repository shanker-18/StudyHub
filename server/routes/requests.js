import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  createRequest, 
  getRequestsForMentor, 
  getRequestsFromLearner,
  getRequestById,
  acceptRequest,
  declineRequest,
  cancelRequest,
  updateRequest
} from '../controllers/requestController.js';

const router = express.Router();

// Create new mentorship request (learner only)
router.post('/', authenticateToken, requireRole('learner'), createRequest);

// Get all requests (with filters)
router.get('/mentor', authenticateToken, requireRole('mentor'), getRequestsForMentor);
router.get('/learner', authenticateToken, requireRole('learner'), getRequestsFromLearner);

// Get specific request
router.get('/:id', authenticateToken, getRequestById);

// Update request (before acceptance)
router.put('/:id', authenticateToken, requireRole('learner'), updateRequest);

// Mentor actions
router.patch('/:id/accept', authenticateToken, requireRole('mentor'), acceptRequest);
router.patch('/:id/decline', authenticateToken, requireRole('mentor'), declineRequest);

// Cancel request (learner or mentor)
router.patch('/:id/cancel', authenticateToken, cancelRequest);

export default router;
