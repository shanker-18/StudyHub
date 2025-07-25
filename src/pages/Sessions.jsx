import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { mockData } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow, format, isAfter, isBefore } from 'date-fns';
import toast from 'react-hot-toast';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSessions(mockData.sessions);
      setLoading(false);
    }, 800);
  }, []);

  const upcomingSessions = sessions.filter(session => 
    session.status === 'upcoming' && isAfter(new Date(session.scheduledAt), new Date())
  );

  const completedSessions = sessions.filter(session => 
    session.status === 'completed' || isBefore(new Date(session.scheduledAt), new Date())
  );

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
      toast.success('Opening meeting link...');
    } else {
      toast.error('Meeting link not available');
    }
  };

  const handleCancelSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s._id !== sessionId));
    toast.success('Session cancelled successfully');
  };

  const handleRateSession = (sessionId, rating) => {
    setSessions(prev => prev.map(s => 
      s._id === sessionId 
        ? { ...s, feedback: { ...s.feedback, rating } }
        : s
    ));
    toast.success('Rating submitted!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return ClockIcon;
      case 'completed': return CheckCircleIcon;
      case 'cancelled': return XCircleIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  const renderStars = (rating, onRate = null, sessionId = null) => {
    return Array.from({ length: 5 }, (_, i) => {
      const StarComponent = onRate ? 'button' : 'div';
      const isFilled = i < (rating || 0);
      
      return (
        <StarComponent
          key={i}
          onClick={onRate ? () => onRate(sessionId, i + 1) : undefined}
          className={`w-5 h-5 ${
            isFilled ? 'text-yellow-400' : 'text-gray-600'
          } ${onRate ? 'hover:text-yellow-300 cursor-pointer transition-colors' : ''}`}
        >
          <StarSolid className="w-full h-full" />
        </StarComponent>
      );
    });
  };

  const SessionCard = ({ session, isUpcoming }) => {
    const StatusIcon = getStatusIcon(session.status);
    const sessionDate = new Date(session.scheduledAt);
    const isWithinHour = isAfter(sessionDate, new Date()) && 
                        (sessionDate.getTime() - new Date().getTime()) < 60 * 60 * 1000;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
              {session.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">{session.topic}</p>
            
            {/* Mentor/Learner Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {isUpcoming ? session.mentorName[0] : session.mentorName[0]}
              </div>
              <div>
                <p className="text-white font-medium">
                  {isUpcoming ? session.mentorName : session.mentorName}
                </p>
                <p className="text-gray-400 text-sm">
                  {isUpcoming ? 'Mentor' : 'Mentor'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(session.status)}`}>
            <StatusIcon className="w-4 h-4" />
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>{format(sessionDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <ClockIcon className="w-4 h-4" />
            <span>{format(sessionDate, 'h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span>•</span>
            <span>{session.duration} minutes</span>
          </div>
        </div>

        {/* Time Until Session */}
        {isUpcoming && (
          <div className="mb-4">
            <p className={`text-sm ${
              isWithinHour ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              {isWithinHour ? '⚡ Starting soon - ' : ''}
              {formatDistanceToNow(sessionDate, { addSuffix: true })}
            </p>
          </div>
        )}

        {/* Feedback Section for Completed Sessions */}
        {!isUpcoming && session.feedback && (
          <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-300">Your Rating:</span>
              <div className="flex items-center gap-1">
                {renderStars(session.feedback.rating)}
              </div>
            </div>
            {session.feedback.comment && (
              <p className="text-sm text-gray-300 italic">"{session.feedback.comment}"</p>
            )}
          </div>
        )}

        {/* Rate Session for Completed Sessions without Rating */}
        {!isUpcoming && !session.feedback?.rating && (
          <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-300 mb-2">Rate this session:</p>
            <div className="flex items-center gap-1">
              {renderStars(0, handleRateSession, session._id)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isUpcoming ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJoinSession(session)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isWithinHour 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400'
                }`}
              >
                <VideoCameraIcon className="w-4 h-4" />
                {isWithinHour ? 'Join Now' : 'Join Session'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCancelSession(session._id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Message Mentor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                <DocumentTextIcon className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading sessions...</p>
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
            <span className="text-gradient">My Sessions</span>
          </h1>
          <p className="text-gray-400 text-lg">Manage your mentorship sessions and track your progress</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-white">{upcomingSessions.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <ClockIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Sessions</p>
                <p className="text-3xl font-bold text-white">{completedSessions.length}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-1 bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10 w-fit">
            {['upcoming', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                ({tab === 'upcoming' ? upcomingSessions.length : completedSessions.length})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              upcomingSessions.length > 0 ? (
                upcomingSessions.map((session, index) => (
                  <SessionCard 
                    key={session._id} 
                    session={session} 
                    isUpcoming={true}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500">Book a session with a mentor to get started</p>
                </motion.div>
              )
            ) : (
              completedSessions.length > 0 ? (
                completedSessions.map((session, index) => (
                  <SessionCard 
                    key={session._id} 
                    session={session} 
                    isUpcoming={false}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircleIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No completed sessions</h3>
                  <p className="text-gray-500">Complete sessions will appear here</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
