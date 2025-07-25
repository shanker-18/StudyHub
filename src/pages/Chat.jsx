import React from 'react';
import { motion } from 'framer-motion';

const Chat = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-cyber">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h1 className="text-4xl lg:text-6xl font-bold font-orbitron mb-6">
            <span className="text-gradient">Chat</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time messaging coming soon...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
