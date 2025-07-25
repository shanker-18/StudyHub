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

export default api;
