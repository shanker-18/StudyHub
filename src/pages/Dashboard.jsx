import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  PlusIcon,
  FireIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';

// 3D Components
const FloatingOrb = ({ position, color, speed = 1 }) => {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere position={position} args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const Dashboard = () => {
  const { user, dbUser } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedGoals: 0,
    totalConnections: 0
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalSessions: 24,
        upcomingSessions: 3,
        completedGoals: 8,
        totalConnections: 15
      });
    }, 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const statCards = [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: CalendarDaysIcon,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      change: '+12%'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: ClockIcon,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      change: '+3 this week'
    },
    {
      title: 'Goals Completed',
      value: stats.completedGoals,
      icon: TrophyIcon,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-500/10',
      change: '+2 this month'
    },
    {
      title: 'Connections',
      value: stats.totalConnections,
      icon: UserGroupIcon,
      color: 'from-orange-500 to-yellow-400',
      bgColor: 'bg-orange-500/10',
      change: '+5 new'
    }
  ];

  const quickActions = [
    {
      title: 'Find Mentors',
      description: 'Discover expert mentors in your field',
      icon: UserGroupIcon,
      link: '/mentors',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Schedule Session',
      description: 'Book a new mentorship session',
      icon: CalendarDaysIcon,
      link: '/sessions',
      color: 'from-purple-500 to-pink-400'
    },
    {
      title: 'View Messages',
      description: 'Check your latest conversations',
      icon: ChatBubbleLeftRightIcon,
      link: '/messages',
      color: 'from-green-500 to-emerald-400'
    },
    {
      title: 'Track Progress',
      description: 'View your achievements and goals',
      icon: ChartBarIcon,
      link: '/achievements',
      color: 'from-orange-500 to-yellow-400'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentor: 'Sarah Chen',
      topic: 'React Best Practices',
      time: '2:00 PM',
      date: 'Today',
      avatar: 'SC'
    },
    {
      id: 2,
      mentor: 'David Kumar',
      topic: 'System Design',
      time: '10:00 AM',
      date: 'Tomorrow',
      avatar: 'DK'
    },
    {
      id: 3,
      mentor: 'Emily Rodriguez',
      topic: 'Career Growth',
      time: '3:30 PM',
      date: 'Friday',
      avatar: 'ER'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
      </div>

      {/* 3D Scene */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-30">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingOrb position={[-1, 0, 0]} color="#00d4ff" speed={0.8} />
          <FloatingOrb position={[1, 1, -1]} color="#a855f7" speed={1.2} />
          <FloatingOrb position={[0, -1, 1]} color="#f472b6" speed={0.6} />
        </Canvas>
      </div>

      <div className="relative z-10 container-cyber py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-4xl lg:text-5xl font-bold font-orbitron mb-2"
                  animate={{
                    backgroundImage: [
                      'linear-gradient(45deg, #00d4ff, #a855f7)',
                      'linear-gradient(45deg, #a855f7, #f472b6)',
                      'linear-gradient(45deg, #f472b6, #10b981)',
                      'linear-gradient(45deg, #10b981, #00d4ff)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Good {timeOfDay}!
                </motion.h1>
                <p className="text-xl text-gray-400">
                  Welcome back, {user?.displayName || dbUser?.name || 'Learner'}! 
                  <span className="ml-2">🚀</span>
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/25">
                  {(user?.displayName || dbUser?.name || 'U')[0]}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-cyan-400" />
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-green-400 font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <BoltIcon className="w-6 h-6 mr-2 text-cyan-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.link}
                      className="block bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                        <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <CalendarDaysIcon className="w-6 h-6 mr-2 text-cyan-400" />
                Upcoming Sessions
              </h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="space-y-4">
                  <AnimatePresence>
                    {upcomingSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {session.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{session.mentor}</p>
                          <p className="text-gray-400 text-sm">{session.topic}</p>
                          <p className="text-cyan-400 text-xs">{session.date} at {session.time}</p>
                        </div>
                        <div className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                          <ClockIcon className="w-4 h-4" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <Link
                  to="/sessions"
                  className="block mt-4 text-center py-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                >
                  View All Sessions →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Achievement Strip */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Achievement Unlocked!</h3>
                    <p className="text-gray-400">You've completed 8 learning goals this month</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+50 XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
