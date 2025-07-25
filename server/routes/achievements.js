import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's achievements
router.get('/my', auth, async (req, res) => {
  try {
    // Mock achievements data - in production, this would query MongoDB
    const achievements = [
      {
        _id: 'a1',
        title: 'First Session Completed',
        description: 'Complete your first mentorship session',
        icon: '🎯',
        category: 'milestone',
        points: 50,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        progress: { current: 1, target: 1 }
      },
      {
        _id: 'a2',
        title: 'Chat Master',
        description: 'Send 50 messages in chat',
        icon: '💬',
        category: 'communication',
        points: 100,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        progress: { current: 67, target: 50 }
      },
      {
        _id: 'a3',
        title: 'Goal Achiever',
        description: 'Complete 5 learning goals',
        icon: '🏆',
        category: 'progress',
        points: 150,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        progress: { current: 8, target: 5 }
      },
      {
        _id: 'a4',
        title: 'Mentor Connector',
        description: 'Connect with 3 different mentors',
        icon: '🤝',
        category: 'networking',
        points: 75,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        progress: { current: 4, target: 3 }
      },
      {
        _id: 'a5',
        title: 'Weekly Warrior',
        description: 'Be active for 7 consecutive days',
        icon: '⚡',
        category: 'consistency',
        points: 200,
        unlocked: false,
        progress: { current: 5, target: 7 }
      },
      {
        _id: 'a6',
        title: 'Session Streak',
        description: 'Complete 10 sessions',
        icon: '🔥',
        category: 'milestone',
        points: 300,
        unlocked: false,
        progress: { current: 4, target: 10 }
      }
    ];
    
    res.json(achievements);
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get all available achievements
router.get('/', auth, async (req, res) => {
  try {
    // Mock all achievements data - in production, this would query MongoDB
    const allAchievements = [
      {
        _id: 'a1',
        title: 'First Session Completed',
        description: 'Complete your first mentorship session',
        icon: '🎯',
        category: 'milestone',
        points: 50,
        target: 1
      },
      {
        _id: 'a2',
        title: 'Chat Master',
        description: 'Send 50 messages in chat',
        icon: '💬',
        category: 'communication',
        points: 100,
        target: 50
      },
      {
        _id: 'a3',
        title: 'Goal Achiever',
        description: 'Complete 5 learning goals',
        icon: '🏆',
        category: 'progress',
        points: 150,
        target: 5
      },
      {
        _id: 'a4',
        title: 'Mentor Connector',
        description: 'Connect with 3 different mentors',
        icon: '🤝',
        category: 'networking',
        points: 75,
        target: 3
      },
      {
        _id: 'a5',
        title: 'Weekly Warrior',
        description: 'Be active for 7 consecutive days',
        icon: '⚡',
        category: 'consistency',
        points: 200,
        target: 7
      },
      {
        _id: 'a6',
        title: 'Session Streak',
        description: 'Complete 10 sessions',
        icon: '🔥',
        category: 'milestone',
        points: 300,
        target: 10
      }
    ];
    
    res.json(allAchievements);
  } catch (error) {
    console.error('Get all achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Update achievement progress
router.patch('/:achievementId/progress', auth, async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { progress } = req.body;
    
    if (!progress || typeof progress.current !== 'number') {
      return res.status(400).json({ error: 'Valid progress data is required' });
    }
    
    // Mock progress update - in production, this would update MongoDB
    const updatedAchievement = {
      _id: achievementId,
      progress,
      updatedAt: new Date()
    };
    
    res.json(updatedAchievement);
  } catch (error) {
    console.error('Update achievement progress error:', error);
    res.status(500).json({ error: 'Failed to update achievement progress' });
  }
});

export default router;
