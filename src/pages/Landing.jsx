import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars,
  Text,
  Float,
  Environment,
  useGLTF,
  Html
} from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  SparklesIcon, 
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

// 3D Components
const OrbitingSphere = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.3;
    meshRef.current.rotation.y += 0.01 * speed;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.5;
  });
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[0.8, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const ConstellationScene = () => {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitingSphere position={[-2, 0, 0]} color="#00d4ff" speed={0.8} />
      <OrbitingSphere position={[2, 1, -1]} color="#a855f7" speed={1.2} />
      <OrbitingSphere position={[0, -2, 1]} color="#f472b6" speed={0.6} />
      <OrbitingSphere position={[-1, 2, -2]} color="#22d3ee" speed={1.5} />
      
      <Text
        position={[0, 0, -5]}
        fontSize={2}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
      >
        SKILLBRIDGE
      </Text>
    </group>
  );
};

const FloatingCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={inView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: 0.8, 
          delay,
          type: "spring",
          damping: 25,
          stiffness: 120
        }
      } : {}}
      whileHover={{ 
        y: -10, 
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      className="card-interactive group perspective-1000"
    >
      {children}
    </motion.div>
  );
};

const StatsCounter = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / 100;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 20);
    }
  }, [inView, end]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-400 font-medium">Active Now</div>
    </motion.div>
  );
};

const Landing = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-600 via-dark-700 to-dark-800" />
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container-cyber">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <motion.div
              style={{ opacity }}
              className="space-y-8 z-10 relative"
            >
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring", damping: 25 }}
              >
                <h1 className="text-6xl lg:text-8xl font-bold font-orbitron leading-tight">
                  <span className="hologram-text block">SKILL</span>
                  <span className="text-gradient block">BRIDGE</span>
                </h1>
                <div className="text-xl lg:text-2xl text-gray-300 mt-4 font-light">
                  Next-Gen Mentorship Platform
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-lg text-gray-400 max-w-2xl leading-relaxed"
              >
                Connect with elite mentors in a futuristic learning environment. 
                Accelerate your growth through personalized guidance, interactive sessions, 
                and cutting-edge learning technologies.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register" className="btn-primary text-center py-4 px-8 text-lg group">
                  <RocketLaunchIcon className="w-5 h-5 inline mr-2 group-hover:animate-bounce-slow" />
                  Start Journey
                </Link>
                <Link to="/mentors" className="btn-secondary text-center py-4 px-8 text-lg group">
                  <SparklesIcon className="w-5 h-5 inline mr-2 group-hover:animate-spin-slow" />
                  Explore Mentors
                </Link>
              </motion.div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="grid grid-cols-3 gap-8 pt-12"
              >
                <StatsCounter end={1247} suffix="+" />
                <StatsCounter end={89} suffix="k+" />
                <StatsCounter end={156} suffix="+" />
              </motion.div>
            </motion.div>

            {/* 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, type: "spring", damping: 20 }}
              className="h-[500px] lg:h-[600px] relative"
            >
              <Canvas 
                camera={{ position: [0, 0, 8], fov: 45 }}
                className="hover:cursor-grab active:cursor-grabbing"
              >
                <Suspense fallback={<Html center><div className="animate-pulse text-neon-blue">Loading...</div></Html>}>
                  <Environment preset="night" />
                  <OrbitControls 
                    enableZoom={false} 
                    autoRotate 
                    autoRotateSpeed={0.5}
                    enablePan={false}
                  />
                  <ConstellationScene />
                </Suspense>
              </Canvas>
              
              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 bg-dark-800/50 backdrop-blur-md rounded-xl p-4 border border-neon-blue/30"
              >
                <div className="text-neon-blue text-sm font-semibold">Live Sessions</div>
                <div className="text-2xl font-bold text-white">127</div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-10 bg-dark-800/50 backdrop-blur-md rounded-xl p-4 border border-neon-purple/30"
              >
                <div className="text-neon-purple text-sm font-semibold">Success Rate</div>
                <div className="text-2xl font-bold text-white">98.7%</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container-cyber">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold font-orbitron mb-6">
              <span className="text-gradient">Why Choose</span>
              <br />
              <span className="hologram-text">SkillBridge?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of mentorship with our advanced platform designed for next-generation learners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AcademicCapIcon,
                title: "Elite Mentors",
                description: "Connect with industry leaders and experts who have shaped the future of technology",
                color: "neon-blue"
              },
              {
                icon: BoltIcon,
                title: "AI-Powered Matching",
                description: "Advanced algorithms ensure perfect mentor-learner compatibility for optimal growth",
                color: "neon-purple"
              },
              {
                icon: GlobeAltIcon,
                title: "Global Network",
                description: "Access mentors from around the world in an immersive virtual environment",
                color: "neon-green"
              },
              {
                icon: ChartBarIcon,
                title: "Progress Analytics",
                description: "Track your learning journey with detailed insights and performance metrics",
                color: "neon-pink"
              },
              {
                icon: ShieldCheckIcon,
                title: "Verified Experts",
                description: "All mentors are thoroughly vetted and verified for expertise and professionalism",
                color: "neon-orange"
              },
              {
                icon: UserGroupIcon,
                title: "Community Driven",
                description: "Join a thriving community of learners and mentors pushing boundaries together",
                color: "neon-blue"
              }
            ].map((feature, index) => (
              <FloatingCard key={index} delay={index * 0.1}>
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-${feature.color} to-${feature.color}/50 flex items-center justify-center shadow-neon group-hover:shadow-neon-purple transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-orbitron">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10" />
        <div className="container-cyber relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl lg:text-6xl font-bold font-orbitron">
              <span className="hologram-text">Ready to Evolve?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join the future of learning today. Your transformation begins with a single step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg py-4 px-8 group"
              >
                <RocketLaunchIcon className="w-5 h-5 inline mr-2 group-hover:animate-bounce-slow" />
                Begin Journey
              </Link>
              <Link 
                to="/select-role" 
                className="btn-secondary text-lg py-4 px-8 group"
              >
                <UserGroupIcon className="w-5 h-5 inline mr-2 group-hover:animate-pulse-slow" />
                Choose Your Path
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
