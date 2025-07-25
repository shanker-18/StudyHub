import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Mock data for now - in production, this would query MongoDB
    const conversations = [
      {
        _id: 'conv1',
        participants: [req.user.uid, 'mentor1'],
        lastMessage: {
          text: 'Thanks for the session!',
          timestamp: new Date(),
          sender: req.user.uid
        },
        unreadCount: 0
      }
    ];
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Mock data for now - in production, this would query MongoDB
    const messages = [
      {
        _id: 'msg1',
        conversationId,
        text: 'Hi! Looking forward to our session.',
        sender: 'mentor1',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'read'
      },
      {
        _id: 'msg2',
        conversationId,
        text: 'Me too! I have some questions prepared.',
        sender: req.user.uid,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'read'
      }
    ];
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a new message
router.post('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    
    // Mock message creation - in production, this would save to MongoDB
    const newMessage = {
      _id: `msg_${Date.now()}`,
      conversationId,
      text: text.trim(),
      sender: req.user.uid,
      timestamp: new Date(),
      status: 'sent'
    };
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create a new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }
    
    // Mock conversation creation - in production, this would save to MongoDB
    const newConversation = {
      _id: `conv_${Date.now()}`,
      participants: [req.user.uid, participantId],
      createdAt: new Date(),
      lastMessage: null,
      unreadCount: 0
    };
    
    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Mark conversation as read
router.patch('/conversations/:conversationId/read', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Mock mark as read - in production, this would update MongoDB
    res.json({ success: true, message: 'Conversation marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark conversation as read' });
  }
});

export default router;
