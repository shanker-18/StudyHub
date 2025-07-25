import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
        <h1 className="text-2xl lg:text-4xl font-bold font-orbitron mb-4">
          <span className="text-gradient">Logging Out...</span>
        </h1>
        <p className="text-gray-400">
          Thank you for using SkillBridge
        </p>
      </motion.div>
    </div>
  );
};

export default Logout;
