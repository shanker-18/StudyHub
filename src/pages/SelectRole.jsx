import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, Environment, Sphere, Box } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  AcademicCapIcon, 
  UserIcon, 
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';

// 3D Components
const HolomodelBox = ({ position, color, isActive, children }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <Box ref={meshRef} args={[2, 2, 2]}>
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={isActive ? 0.8 : 0.4}
            wireframe={!isActive}
          />
        </Box>
        {children}
      </group>
    </Float>
  );
};

const HolographicText = ({ text, position, color }) => {
  return (
    <Text
      position={position}
      fontSize={0.5}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const RoleCard = ({ 
  title, 
  description, 
  features, 
  icon: Icon, 
  gradient, 
  isSelected, 
  onSelect, 
  animationDelay 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{ 
        duration: 0.8, 
        delay: animationDelay,
        type: "spring",
        damping: 25,
        stiffness: 120
      }}
      whileHover={{ 
        y: -10, 
        rotateX: 5,
        scale: isSelected ? 1.05 : 1.02,
        transition: { duration: 0.3 }
      }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl p-8 backdrop-blur-md border-2 transition-all duration-500
        ${isSelected 
          ? 'bg-dark-700/50 border-neon-blue shadow-neon' 
          : 'bg-dark-800/30 border-gray-700/50 hover:border-gray-600/50'
        }
      `}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
        isSelected ? gradient : 'bg-transparent'
      }`} />
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          animate={isSelected ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0] 
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: isSelected ? Infinity : 0,
            ease: "easeInOut"
          }}
          className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center ${
            isSelected 
              ? 'bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon' 
              : 'bg-dark-700/50 border border-gray-600'
          }`}
        >
          <Icon className={`w-10 h-10 ${
            isSelected ? 'text-white' : 'text-gray-400'
          }`} />
        </motion.div>

        <h3 className={`text-2xl font-bold font-orbitron ${
          isSelected ? 'text-gradient' : 'text-white'
        }`}>
          {title}
        </h3>

        <p className="text-gray-400 text-lg leading-relaxed">
          {description}
        </p>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + 0.2 + (index * 0.1) }}
              className="flex items-center space-x-3 text-left"
            >
              <SparklesIcon className="w-4 h-4 text-neon-blue flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </motion.div>
          ))}
        </div>

        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4"
          >
            <div className="inline-flex items-center space-x-2 text-neon-blue font-semibold">
              <span>Selected</span>
              <ArrowRightIcon className="w-4 h-4 animate-bounce-slow" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, registerInDatabase } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'learner',
      title: 'Learner',
      description: 'Accelerate your growth by connecting with expert mentors and accessing personalized learning paths.',
      features: [
        'Connect with industry experts',
        'Personalized learning paths',
        'Real-time feedback and guidance',
        'Progress tracking and analytics',
        'Community discussions'
      ],
      icon: UserIcon,
      gradient: 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20'
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Share your expertise, guide the next generation, and build meaningful connections in your field.',
      features: [
        'Share your expertise globally',
        'Flexible mentoring schedule',
        'Earn through knowledge sharing',
        'Build your professional network',
        'Make lasting impact'
      ],
      icon: AcademicCapIcon,
      gradient: 'bg-gradient-to-br from-neon-purple/20 to-neon-pink/20'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    setIsLoading(true);
    
    try {
      // Register user in database with selected role
      await registerInDatabase({
        name: user.displayName || user.email.split('@')[0],
        role: selectedRole,
        bio: '',
        skills: [],
        location: ''
      });

      // Show success animation
      toast.success(`Welcome as a ${selectedRole}! 🚀`);
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error('Failed to set up your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-600 via-dark-700 to-dark-800" />
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-cyber">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-7xl font-bold font-orbitron mb-6">
            <span className="hologram-text">Choose Your</span>
            <br />
            <span className="text-gradient">Path</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Select your role in the SkillBridge ecosystem. Whether you're here to learn or teach, 
            your journey to excellence starts with this choice.
          </p>
        </motion.div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-60 mb-16 relative"
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Suspense fallback={null}>
              <Environment preset="night" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
              
              <HolomodelBox 
                position={[-3, 0, 0]} 
                color="#00d4ff" 
                isActive={selectedRole === 'learner'}
              >
                <HolographicText 
                  text="LEARNER" 
                  position={[0, 2.5, 0]} 
                  color="#00d4ff" 
                />
              </HolomodelBox>
              
              <HolomodelBox 
                position={[3, 0, 0]} 
                color="#a855f7" 
                isActive={selectedRole === 'mentor'}
              >
                <HolographicText 
                  text="MENTOR" 
                  position={[0, 2.5, 0]} 
                  color="#a855f7" 
                />
              </HolomodelBox>
              
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {roles.map((role, index) => (
            <RoleCard
              key={role.id}
              {...role}
              isSelected={selectedRole === role.id}
              onSelect={() => handleRoleSelect(role.id)}
              animationDelay={index * 0.2}
            />
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <AnimatePresence>
            {selectedRole && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                disabled={isLoading}
                className={`btn-primary text-lg py-4 px-12 group relative overflow-hidden ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up your account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <RocketLaunchIcon className="w-5 h-5 group-hover:animate-bounce-slow" />
                    <span>Continue to Dashboard</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Don't worry, you can always change your role later in settings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectRole;
