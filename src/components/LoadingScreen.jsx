import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const loadingVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.2, 1],
    opacity: [0, 1, 0],
  },
};

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Connecting to services...',
      'Loading your experience...',
      'Almost ready...'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-600 z-50">
      <motion.div
        className="h-32 w-32 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink mb-8"
        variants={loadingVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 2, repeat: Infinity }}
      ></motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold font-orbitron text-gradient mb-2">
          SKILLBRIDGE
        </h2>
        <p className="text-gray-400 text-lg">
          {loadingText}
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-blue rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

