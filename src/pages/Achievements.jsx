import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon, 
  CheckBadgeIcon, 
  BoltIcon, 
  SparklesIcon, 
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { mockData } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAchievements(mockData.achievements);
      setLoading(false);
    }, 800);
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'milestone': return TrophyIcon;
      case 'communication': return ChatBubbleLeftRightIcon;
      case 'progress': return BoltIcon;
      case 'networking': return UserCircleIcon;
      case 'consistency': return SparklesIcon;
      default: return CheckBadgeIcon;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'milestone': return 'from-yellow-500 to-orange-500';
      case 'communication': return 'from-blue-500 to-cyan-500';
      case 'progress': return 'from-green-500 to-emerald-500';
      case 'networking': return 'from-purple-500 to-pink-500';
      case 'consistency': return 'from-indigo-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleAchievementClick = (achievement) => {
    if (achievement.unlocked) {
      toast.success(`${achievement.title} - Unlocked on ${format(achievement.unlockedAt, 'MMM dd, yyyy')}!`, {
        icon: achievement.icon,
        duration: 3000
      });
    } else {
      toast(`Progress: ${achievement.progress.current}/${achievement.progress.target}`, {
        icon: '📊',
        duration: 2000
      });
    }
  };

  const categories = ['all', 'milestone', 'communication', 'progress', 'networking', 'consistency'];
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="container-cyber py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold font-orbitron mb-4">
            <span className="text-gradient">Achievements</span>
          </h1>
          <p className="text-gray-400 text-lg">Track your progress and unlock amazing rewards</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Achievements Unlocked</p>
                <p className="text-3xl font-bold text-white">{unlockedCount}/{achievements.length}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <TrophyIcon className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total XP Earned</p>
                <p className="text-3xl font-bold text-white">{totalPoints}</p>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckBadgeIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 w-fit">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAchievements.map((achievement, index) => {
              const IconComponent = getCategoryIcon(achievement.category);
              const progressPercentage = (achievement.progress.current / achievement.progress.target) * 100;
              
              return (
                <motion.div
                  key={achievement._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: achievement.unlocked ? 5 : 0,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAchievementClick(achievement)}
                  className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer group ${
                    achievement.unlocked ? 'opacity-100' : 'opacity-75'
                  }`}
                >
                  {/* Unlock Glow Effect */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {/* Achievement Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(achievement.category)} ${
                      achievement.unlocked ? 'shadow-lg' : 'grayscale'
                    }`}>
                      <div className="text-4xl">{achievement.icon}</div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckBadgeIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400 mb-1">
                        <SparklesIcon className="w-4 h-4" />
                        <span className="text-sm font-bold">+{achievement.points} XP</span>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-xs text-green-400">
                          {format(achievement.unlockedAt, 'MMM dd')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Achievement Info */}
                  <div className="mb-4">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Progress</span>
                      <span className={achievement.unlocked ? 'text-green-400' : 'text-gray-400'}>
                        {achievement.progress.current}/{achievement.progress.target}
                      </span>
                    </div>
                    
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className={`h-full bg-gradient-to-r ${
                          achievement.unlocked 
                            ? 'from-green-500 to-emerald-400'
                            : 'from-cyan-500 to-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Locked/Unlocked Indicator */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className={`flex items-center gap-2 text-sm ${
                      achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                      <span className="capitalize">
                        {achievement.unlocked ? 'Unlocked' : `${achievement.category} Achievement`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TrophyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No achievements in this category</h3>
            <p className="text-gray-500">Try selecting a different category or start unlocking achievements!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
