import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';
import { connectDB } from './config/db.js';
import { initializeFirebase } from './config/firebase.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import mentorRoutes from './routes/mentors.js';
import requestRoutes from './routes/requests.js';
import sessionRoutes from './routes/sessions.js';
import chatRoutes from './routes/chat.js';
import achievementRoutes from './routes/achievements.js';

// Load environment variables
dotenv.config();

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug paths in production and determine correct client path
let clientDistPath = path.join(__dirname, '../client/dist');
let indexHtmlPath = path.join(clientDistPath, 'index.html');

console.log('🔍 Current working directory:', process.cwd());
console.log('🔍 Server __dirname:', __dirname);
console.log('🔍 Client dist path (attempt 1):', clientDistPath);

// Check if client dist exists, if not try alternative paths
if (!existsSync(clientDistPath)) {
  // Try from server directory going up to parent then to client
  const altPath1 = path.resolve(__dirname, '../client/dist');
  const altPath2 = path.resolve(process.cwd(), '../client/dist');
  const altPath3 = path.resolve(__dirname, '../../client/dist');
  
  console.log('🔍 Trying alternative paths...');
  console.log('🔍 Alt path 1:', altPath1, 'exists:', existsSync(altPath1));
  console.log('🔍 Alt path 2:', altPath2, 'exists:', existsSync(altPath2));
  console.log('🔍 Alt path 3:', altPath3, 'exists:', existsSync(altPath3));
  
  if (existsSync(altPath1)) {
    clientDistPath = altPath1;
  } else if (existsSync(altPath2)) {
    clientDistPath = altPath2;
  } else if (existsSync(altPath3)) {
    clientDistPath = altPath3;
  }
  
  indexHtmlPath = path.join(clientDistPath, 'index.html');
}

console.log('🔍 Final client dist path:', clientDistPath);
console.log('🔍 Final index.html path:', indexHtmlPath);
console.log('🔍 Client dist exists:', existsSync(clientDistPath));
console.log('🔍 Index.html exists:', existsSync(indexHtmlPath));

if (existsSync(clientDistPath)) {
  console.log('🔍 Dist directory contents:', readdirSync(clientDistPath));
} else {
  console.log('❌ Client dist directory still not found!');
  console.log('🔍 Current directory contents:', readdirSync(process.cwd()));
  // List parent directory
  const parentDir = path.resolve(process.cwd(), '..');
  if (existsSync(parentDir)) {
    console.log('🔍 Parent directory contents:', readdirSync(parentDir));
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://localhost:3000',
  'https://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'StudyHub API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

// Serve frontend build (only if client dist exists)
if (existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  console.log('✅ Serving static files from:', clientDistPath);
} else {
  console.log('⚠️ No static files to serve - client dist not found');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Fallback for React Router (catch-all handler)
app.get('*', (req, res) => {
  if (existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(404).json({ 
      error: 'Frontend not found',
      message: 'React app is not built or deployed properly',
      path: indexHtmlPath
    });
  }
});

// Initialize services and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Firebase Admin
    initializeFirebase();
    
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
