import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  BoltIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  AcademicCapIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { to: '/mentors', label: 'Mentors', icon: AcademicCapIcon },
    { to: '/sessions', label: 'Sessions', icon: CalendarDaysIcon, protected: true },
    { to: '/chat', label: 'Chat', icon: ChatBubbleLeftRightIcon, protected: true },
    { to: '/achievements', label: 'Achievements', icon: TrophyIcon, protected: true },
  ];

  const profileMenuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
    { action: handleLogout, label: 'Logout', icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-800/80 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-cyber">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <BoltIcon className="w-8 h-8 text-neon-blue" />
              <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            </motion.div>
            <div className="text-2xl font-bold font-orbitron">
              <span className="hologram-text">SKILL</span>
              <span className="text-gradient">BRIDGE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link flex items-center space-x-2 ${
                    isActive ? 'text-neon-blue' : ''
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-dark-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 hover:border-neon-blue/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    {dbUser?.avatarURL ? (
                      <img 
                        src={dbUser.avatarURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-neon-blue/30" 
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-gray-400 group-hover:text-neon-blue transition-colors" />
                    )}
                    <div className="absolute -top-1 -right-1">
                      <div className="status-online" />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">
                      {dbUser?.name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {dbUser?.role || 'User'}
                    </div>
                  </div>
                  <ChevronDownIcon 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-dark-800/90 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
                    >
                      {profileMenuItems.map((item, index) => (
                        item.to ? (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all duration-200 group first:rounded-t-xl last:rounded-b-xl"
                          >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
                            <span>{item.label}</span>
                          </Link>
                        ) : (
                          <button
                            key={index}
                            onClick={item.action}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all duration-200 group first:rounded-t-xl last:rounded-b-xl"
                          >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-neon-pink transition-colors" />
                            <span>{item.label}</span>
                          </button>
                        )
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-neon-blue transition-colors duration-200 p-2"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-gray-800/50">
                {navLinks.map((link) => {
                  if (link.protected && !user) return null;
                  
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-neon-blue hover:bg-dark-800/50 rounded-lg transition-all duration-200"
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                
                {user ? (
                  <div className="space-y-2 pt-4 border-t border-gray-800/50 mt-4">
                    <div className="px-4 py-3 text-sm text-gray-400">
                      Signed in as <span className="text-white font-medium">{dbUser?.name || user.email}</span>
                    </div>
                    {profileMenuItems.map((item, index) => (
                      item.to ? (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-neon-blue hover:bg-dark-800/50 rounded-lg transition-all duration-200"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-neon-pink hover:bg-dark-800/50 rounded-lg transition-all duration-200"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t border-gray-800/50 mt-4">
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-neon-blue hover:bg-dark-800/50 rounded-lg transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsOpen(false)}
                      className="block btn-primary text-center mx-4"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
