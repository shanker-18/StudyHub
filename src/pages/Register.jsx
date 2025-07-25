import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, loginWithGoogle, registerInDatabase, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Register with Firebase
      const result = await register(formData.email, formData.password);
      
      // Register in database
      await registerInDatabase({
        name: formData.name,
        role: formData.role,
        bio: '',
        skills: [],
        location: ''
      });
      
      // Success animation
      toast.success('Welcome to SkillBridge! 🎉', {
        duration: 3000,
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#00d4ff',
          border: '1px solid rgba(0, 212, 255, 0.3)',
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      setErrors({ 
        general: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success('Welcome to SkillBridge! 🚀');
      navigate('/select-role');
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error('Google signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: '0 0 0px rgba(0, 212, 255, 0)',
      transition: { duration: 0.2 }
    }
  };

  const roleCardVariants = {
    unselected: {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transition: { duration: 0.2 }
    },
    selected: {
      scale: 1.05,
      borderColor: 'rgba(0, 212, 255, 0.5)',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      borderColor: 'rgba(0, 212, 255, 0.3)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Main Register Card */}
      <motion.div
        className="w-full max-w-lg relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 1 ? 'bg-cyan-400 text-gray-900' : 'bg-gray-700 text-gray-400'
                }`}
                animate={{ scale: currentStep === 1 ? 1.1 : 1 }}
              >
                1
              </motion.div>
              <div className="flex-1 h-1 mx-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  animate={{ width: currentStep >= 2 ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= 2 ? 'bg-cyan-400 text-gray-900' : 'bg-gray-700 text-gray-400'
                }`}
                animate={{ scale: currentStep === 2 ? 1.1 : 1 }}
              >
                2
              </motion.div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Account Details</span>
              <span>Choose Role</span>
            </div>
          </div>

          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.h1 
              className="text-4xl font-bold font-orbitron mb-2"
              animate={{
                backgroundImage: [
                  'linear-gradient(45deg, #00d4ff, #10b981)',
                  'linear-gradient(45deg, #10b981, #a855f7)',
                  'linear-gradient(45deg, #a855f7, #f472b6)',
                  'linear-gradient(45deg, #f472b6, #00d4ff)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Join SkillBridge
            </motion.h1>
            <p className="text-gray-400 text-lg">
              {currentStep === 1 ? 'Create your account' : 'Choose your path'}
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              // Step 1: Account Details
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={focusedField === 'name' ? { scale: 1.1, color: '#00d4ff' } : { scale: 1, color: '#9ca3af' }}
                    >
                      <UserIcon className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      variants={inputVariants}
                      animate={focusedField === 'name' ? 'focus' : 'blur'}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{
                        width: focusedField === 'name' ? '100%' : '0%',
                        opacity: focusedField === 'name' ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-red-400 text-sm"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={focusedField === 'email' ? { scale: 1.1, color: '#00d4ff' } : { scale: 1, color: '#9ca3af' }}
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      variants={inputVariants}
                      animate={focusedField === 'email' ? 'focus' : 'blur'}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{
                        width: focusedField === 'email' ? '100%' : '0%',
                        opacity: focusedField === 'email' ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-red-400 text-sm"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={focusedField === 'password' ? { scale: 1.1, color: '#00d4ff' } : { scale: 1, color: '#9ca3af' }}
                    >
                      <LockClosedIcon className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      variants={inputVariants}
                      animate={focusedField === 'password' ? 'focus' : 'blur'}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{
                        width: focusedField === 'password' ? '100%' : '0%',
                        opacity: focusedField === 'password' ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-red-400 text-sm"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      animate={focusedField === 'confirmPassword' ? { scale: 1.1, color: '#00d4ff' } : { scale: 1, color: '#9ca3af' }}
                    >
                      <LockClosedIcon className="h-5 w-5" />
                    </motion.div>
                    <motion.input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      variants={inputVariants}
                      animate={focusedField === 'confirmPassword' ? 'focus' : 'blur'}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{
                        width: focusedField === 'confirmPassword' ? '100%' : '0%',
                        opacity: focusedField === 'confirmPassword' ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 text-red-400 text-sm"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Next Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Next Step</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-950 text-gray-400">Or continue with</span>
                  </div>
                </motion.div>

                {/* Google Signup Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </motion.button>
                </motion.div>
              </motion.form>
            ) : (
              // Step 2: Role Selection
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Choose Your Role</h3>
                  <p className="text-gray-400">Select how you want to use SkillBridge</p>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Learner Role */}
                  <motion.div
                    variants={roleCardVariants}
                    animate={formData.role === 'learner' ? 'selected' : 'unselected'}
                    whileHover="hover"
                    onClick={() => handleRoleSelect('learner')}
                    className="p-6 rounded-xl border cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        formData.role === 'learner' ? 'bg-cyan-400/20' : 'bg-white/5'
                      }`}>
                        <UserIcon className={`w-8 h-8 ${
                          formData.role === 'learner' ? 'text-cyan-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">Learner</h4>
                        <p className="text-gray-400 text-sm">Connect with mentors to accelerate your growth</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <SparklesIcon className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs text-cyan-400">Find mentors, learn skills, grow faster</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mentor Role */}
                  <motion.div
                    variants={roleCardVariants}
                    animate={formData.role === 'mentor' ? 'selected' : 'unselected'}
                    whileHover="hover"
                    onClick={() => handleRoleSelect('mentor')}
                    className="p-6 rounded-xl border cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        formData.role === 'mentor' ? 'bg-purple-400/20' : 'bg-white/5'
                      }`}>
                        <AcademicCapIcon className={`w-8 h-8 ${
                          formData.role === 'mentor' ? 'text-purple-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">Mentor</h4>
                        <p className="text-gray-400 text-sm">Share your expertise and guide others</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <SparklesIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-400">Teach, inspire, make an impact</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {errors.role && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-400 text-sm text-center"
                    >
                      {errors.role}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: isLoading ? ['-100%', '200%'] : '-100%'
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isLoading ? Infinity : 0,
                        ease: 'linear'
                      }}
                    />
                    
                    <div className="flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
