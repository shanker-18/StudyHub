import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // Login with email and password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Register with email and password
  const register = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Welcome to StudyHub!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Register user in database
  const registerInDatabase = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setDbUser(response.data.user);
      toast.success('Profile created successfully!');
      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create profile');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to log out');
      throw error;
    }
  };

  // Get current user from database
  const getCurrentDbUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setDbUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to get user from database:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      setDbUser(response.data.user);
      toast.success('Profile updated successfully!');
      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // User is signed in, get their database record
          try {
            await getCurrentDbUser();
          } catch (error) {
            console.error('Failed to get user from database:', error);
            // Don't fail the auth process if DB is down
          }
        } else {
          // User is signed out
          setDbUser(null);
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setLoading(false);
      toast.error('Authentication service unavailable.');
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    dbUser,
    loading,
    login,
    register,
    loginWithGoogle,
    registerInDatabase,
    logout,
    updateProfile,
    getCurrentDbUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
