import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
  updateSessionNotes,
  addSessionFeedback,
  cancelSession,
  markSessionComplete
} from '../controllers/sessionController.js';

const router = express.Router();

// Create new session (from accepted request)
router.post('/', authenticateToken, createSession);

// Get user's sessions (mentor or learner)
router.get('/my', authenticateToken, getUserSessions);

// Get specific session
router.get('/:id', authenticateToken, getSessionById);

// Update session details
router.put('/:id', authenticateToken, updateSession);

// Update session notes
router.patch('/:id/notes', authenticateToken, updateSessionNotes);

// Add feedback after session
router.patch('/:id/feedback', authenticateToken, addSessionFeedback);

// Cancel session
router.patch('/:id/cancel', authenticateToken, cancelSession);

// Mark session as complete
router.patch('/:id/complete', authenticateToken, markSessionComplete);

export default router;
