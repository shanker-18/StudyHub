import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  fromUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  toMentorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending',
    index: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  sessionType: {
    type: String,
    enum: ['one-time', 'recurring', 'project-based'],
    default: 'one-time'
  },
  preferredSchedule: {
    date: Date,
    time: String,
    duration: {
      type: Number,
      default: 60 // minutes
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  responseMessage: {
    type: String,
    maxlength: 1000
  },
  respondedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
requestSchema.index({ toMentorID: 1, status: 1 });
requestSchema.index({ fromUserID: 1, status: 1 });
requestSchema.index({ status: 1, createdAt: -1 });

// TTL index for expired requests
requestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);
