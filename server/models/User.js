import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['mentor', 'learner'],
    required: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  avatarURL: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  hourlyRate: {
    type: Number,
    default: 0,
    min: 0
  },
  availability: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    schedule: {
      type: Map,
      of: [{
        start: String,
        end: String
      }],
      default: new Map()
    }
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for text search
userSchema.index({ 
  name: 'text', 
  bio: 'text', 
  skills: 'text' 
});

// Index for location-based queries
userSchema.index({ location: 1 });

// Index for role-based queries
userSchema.index({ role: 1, isActive: 1 });

export default mongoose.model('User', userSchema);
