import axios from 'axios';
import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  search: (params) => api.get('/users/search', { params }),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Mentors API
export const mentorsAPI = {
  getAll: (params) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  search: (params) => api.get('/mentors/search', { params }),
  getBySkill: (skill, params) => api.get(`/mentors/skill/${skill}`, { params }),
  getFeatured: (params) => api.get('/mentors/featured', { params }),
};

// Requests API
export const requestsAPI = {
  create: (requestData) => api.post('/requests', requestData),
  getForMentor: (params) => api.get('/requests/mentor', { params }),
  getFromLearner: (params) => api.get('/requests/learner', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  update: (id, requestData) => api.put(`/requests/${id}`, requestData),
  accept: (id, responseData) => api.patch(`/requests/${id}/accept`, responseData),
  decline: (id, responseData) => api.patch(`/requests/${id}/decline`, responseData),
  cancel: (id) => api.patch(`/requests/${id}/cancel`),
};

// Sessions API
export const sessionsAPI = {
  create: (sessionData) => api.post('/sessions', sessionData),
  getUserSessions: (params) => api.get('/sessions/my', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  update: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  updateNotes: (id, notes) => api.patch(`/sessions/${id}/notes`, { notes }),
  addFeedback: (id, feedback) => api.patch(`/sessions/${id}/feedback`, feedback),
  cancel: (id) => api.patch(`/sessions/${id}/cancel`),
  complete: (id) => api.patch(`/sessions/${id}/complete`),
};

// Chat API
export const chatAPI = {
  getConversations: (params) => api.get('/chat/conversations', { params }),
  getMessages: (conversationId, params) => api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, messageData) => api.post(`/chat/conversations/${conversationId}/messages`, messageData),
  createConversation: (participantId) => api.post('/chat/conversations', { participantId }),
  markAsRead: (conversationId) => api.patch(`/chat/conversations/${conversationId}/read`),
};

// Achievements API
export const achievementsAPI = {
  getUserAchievements: (params) => api.get('/achievements/my', { params }),
  getAllAchievements: (params) => api.get('/achievements', { params }),
  updateProgress: (achievementId, progress) => api.patch(`/achievements/${achievementId}/progress`, { progress }),
};

// Mock data for development
export const mockData = {
  // Mock mentors data
  mentors: [
    {
      _id: '1',
      name: 'Sarah Chen',
      domain: 'React & Frontend Design',
      experience: 5,
      bio: 'Passionate frontend developer with expertise in React, TypeScript, and modern web technologies. I love helping developers build beautiful, performant applications.',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'UI/UX Design'],
      availability: ['Mon 2-6 PM', 'Wed 10 AM-2 PM', 'Fri 1-5 PM'],
      totalSessions: 156,
      responseTime: '< 2 hours'
    },
    {
      _id: '2',
      name: 'David Kumar',
      domain: 'System Design & DSA',
      experience: 8,
      bio: 'Senior Software Engineer at Google with extensive experience in system design and algorithmic problem solving. Former competitive programmer.',
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      skills: ['System Design', 'Data Structures', 'Algorithms', 'Java', 'Python', 'Distributed Systems'],
      availability: ['Tue 3-7 PM', 'Thu 9 AM-1 PM', 'Sat 10 AM-2 PM'],
      totalSessions: 203,
      responseTime: '< 1 hour'
    },
    {
      _id: '3',
      name: 'Emily Rodriguez',
      domain: 'ML & Python',
      experience: 4,
      bio: 'Machine Learning Engineer specializing in deep learning and computer vision. PhD in Computer Science with focus on AI applications.',
      rating: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
      availability: ['Mon 1-5 PM', 'Wed 3-7 PM', 'Fri 10 AM-2 PM'],
      totalSessions: 89,
      responseTime: '< 3 hours'
    },
    {
      _id: '4',
      name: 'James Patel',
      domain: 'Fullstack Web Dev',
      experience: 6,
      bio: 'Full-stack developer with expertise in modern web technologies. Built and scaled applications serving millions of users.',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      skills: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS', 'Docker'],
      availability: ['Tue 2-6 PM', 'Thu 11 AM-3 PM', 'Sun 1-5 PM'],
      totalSessions: 134,
      responseTime: '< 2 hours'
    },
    {
      _id: '5',
      name: 'Aisha Malik',
      domain: 'UI/UX & Product Design',
      experience: 7,
      bio: 'Senior Product Designer with experience at top tech companies. Passionate about creating user-centered designs that solve real problems.',
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
      availability: ['Mon 10 AM-2 PM', 'Wed 1-5 PM', 'Fri 3-7 PM'],
      totalSessions: 178,
      responseTime: '< 1 hour'
    },
    {
      _id: '6',
      name: 'Anand Roy',
      domain: 'DevOps & Cloud',
      experience: 10,
      bio: 'DevOps Architect with 10+ years of experience in cloud infrastructure, automation, and scalable system design. AWS and Kubernetes expert.',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Monitoring'],
      availability: ['Tue 9 AM-1 PM', 'Thu 2-6 PM', 'Sat 11 AM-3 PM'],
      totalSessions: 267,
      responseTime: '< 30 mins'
    }
  ],

  // Mock sessions data
  sessions: [
    {
      _id: 's1',
      title: 'React Best Practices & Performance',
      mentorId: '1',
      mentorName: 'Sarah Chen',
      learnerId: 'current-user',
      learnerName: 'You',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      status: 'upcoming',
      topic: 'React optimization techniques and best practices',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      _id: 's2',
      title: 'System Design: Chat Application',
      mentorId: '2',
      mentorName: 'David Kumar',
      learnerId: 'current-user',
      learnerName: 'You',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 90,
      status: 'upcoming',
      topic: 'Designing scalable real-time chat systems',
      meetingLink: 'https://meet.google.com/xyz-uvwx-yz'
    },
    {
      _id: 's3',
      title: 'ML Model Deployment Strategies',
      mentorId: '3',
      mentorName: 'Emily Rodriguez',
      learnerId: 'current-user',
      learnerName: 'You',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 75,
      status: 'upcoming',
      topic: 'Best practices for deploying ML models to production',
      meetingLink: 'https://meet.google.com/lmn-opqr-stu'
    },
    {
      _id: 's4',
      title: 'Full-Stack Architecture Review',
      mentorId: '4',
      mentorName: 'James Patel',
      learnerId: 'current-user',
      learnerName: 'You',
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
      duration: 60,
      status: 'completed',
      topic: 'Code review and architecture improvements',
      feedback: {
        rating: 5,
        comment: 'Excellent session! James provided great insights on improving my application architecture.'
      }
    }
  ],

  // Mock achievements data
  achievements: [
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
  ]
};

export default api;
