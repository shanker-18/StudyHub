import admin from 'firebase-admin';
import User from '../models/User.js';

// ✅ AUTHENTICATE TOKEN
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Development mode bypass
    if (process.env.NODE_ENV === 'development' && token === 'dev-token') {
      const mockUser = await User.findOne() || new User({
        uid: 'dev-user',
        email: 'dev@studyhub.com',
        name: 'Dev User',
        role: 'mentor'
      });

      req.user = {
        uid: 'dev-user',
        email: 'dev@studyhub.com',
        dbUser: mockUser
      };
      return next();
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      dbUser: user
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ ROLE-BASED ACCESS CONTROL
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.dbUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.dbUser.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

// ✅ OPTIONAL AUTH FOR PUBLIC ROUTES
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });

      if (user) {
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          dbUser: user
        };
      }
    }

    next();
  } catch (error) {
    // Skip error if token is invalid – this is optional
    next();
  }
};
