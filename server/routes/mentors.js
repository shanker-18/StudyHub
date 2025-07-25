import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { 
  getAllMentors, 
  getMentorById, 
  searchMentors,
  getMentorsBySkill,
  getFeaturedMentors
} from '../controllers/mentorController.js';

const router = express.Router();

// Get all mentors
router.get('/', optionalAuth, getAllMentors);

// Get featured mentors
router.get('/featured', optionalAuth, getFeaturedMentors);

// Search mentors
router.get('/search', optionalAuth, searchMentors);

// Get mentors by skill
router.get('/skill/:skill', optionalAuth, getMentorsBySkill);

// Get mentor by ID
router.get('/:id', optionalAuth, getMentorById);

export default router;
