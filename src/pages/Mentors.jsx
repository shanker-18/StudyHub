import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { mockData } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Mentors = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMentors(mockData.mentors);
      setFilteredMentors(mockData.mentors);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = mentors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.domain.toLowerCase().includes(selectedDomain.toLowerCase())
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(mentor => mentor.rating >= minRating);
    }

    // Experience filter
    if (minExperience > 0) {
      filtered = filtered.filter(mentor => mentor.experience >= minExperience);
    }

    setFilteredMentors(filtered);
  }, [mentors, searchTerm, selectedDomain, minRating, minExperience]);

  const domains = [
    'all',
    'React & Frontend',
    'System Design',
    'Machine Learning',
    'Fullstack',
    'UI/UX Design',
    'DevOps & Cloud'
  ];

  const handleRequestSession = (mentor) => {
    if (!user) {
      toast.error('Please login to request a session');
      return;
    }
    toast.success(`Session request sent to ${mentor.name}!`);
  };

  const handleStartChat = (mentor) => {
    if (!user) {
      toast.error('Please login to start chatting');
      return;
    }
    toast.success(`Starting chat with ${mentor.name}...`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolid
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading mentors...</p>
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
            <span className="text-gradient">Find Your Mentor</span>
          </h1>
          <p className="text-gray-400 text-lg">Connect with expert mentors and accelerate your learning journey</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors, skills, or domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:border-cyan-400/50 transition-all"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Domain Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400/50"
                    >
                      {domains.map(domain => (
                        <option key={domain} value={domain} className="bg-gray-800">
                          {domain === 'all' ? 'All Domains' : domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Rating</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400/50"
                    >
                      <option value={0} className="bg-gray-800">Any Rating</option>
                      <option value={4} className="bg-gray-800">4+ Stars</option>
                      <option value={4.5} className="bg-gray-800">4.5+ Stars</option>
                      <option value={4.8} className="bg-gray-800">4.8+ Stars</option>
                    </select>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Experience</label>
                    <select
                      value={minExperience}
                      onChange={(e) => setMinExperience(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400/50"
                    >
                      <option value={0} className="bg-gray-800">Any Experience</option>
                      <option value={3} className="bg-gray-800">3+ Years</option>
                      <option value={5} className="bg-gray-800">5+ Years</option>
                      <option value={8} className="bg-gray-800">8+ Years</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-400">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
              >
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={mentor.profileImage}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-950 flex items-center justify-center">
                      <CheckBadgeIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-cyan-400 font-medium">{mentor.domain}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {renderStars(mentor.rating)}
                      </div>
                      <span className="text-sm text-gray-400">({mentor.rating})</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {mentor.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-cyan-400/10 text-cyan-400 text-xs rounded-lg border border-cyan-400/20"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-lg">
                        +{mentor.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{mentor.experience}</div>
                    <div className="text-xs text-gray-400">Years Exp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{mentor.totalSessions}</div>
                    <div className="text-xs text-gray-400">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{mentor.responseTime}</div>
                    <div className="text-xs text-gray-400">Response</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequestSession(mentor)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all font-medium"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Request Session
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartChat(mentor)}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No mentors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
