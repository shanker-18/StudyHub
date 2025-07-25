import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initializeFirebase } from './config/firebase.js';

// Import API routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import mentorRoutes from './routes/mentors.js';
import requestRoutes from './routes/requests.js';
import sessionRoutes from './routes/sessions.js';
import chatRoutes from './routes/chat.js';
import achievementRoutes from './routes/achievements.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client build (go up one level from server to project root)
const clientDistPath = path.join(__dirname, '../client/dist');
console.log('🔍 Server __dirname:', __dirname);
console.log('🔍 Client dist path:', clientDistPath);
console.log('🔍 Path exists:', fs.existsSync(clientDistPath));
app.use(express.static(clientDistPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'StudyHub API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

// Fallback: Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Initialize services and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Firebase Admin
    initializeFirebase();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 StudyHub server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
