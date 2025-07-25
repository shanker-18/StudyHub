import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  learnerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mentorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  requestID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 240 // 4 hours max
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
    index: true
  },
  meetingLink: {
    type: String,
    default: ''
  },
  notes: {
    mentor: {
      type: String,
      maxlength: 2000,
      default: ''
    },
    learner: {
      type: String,
      maxlength: 2000,
      default: ''
    }
  },
  objectives: [{
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['link', 'document', 'video', 'book', 'other'],
      default: 'link'
    }
  }],
  feedback: {
    learnerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    learnerComment: {
      type: String,
      maxlength: 500
    },
    mentorComment: {
      type: String,
      maxlength: 500
    }
  },
  actualStartTime: Date,
  actualEndTime: Date,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly']
    },
    endDate: Date
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
sessionSchema.index({ learnerID: 1, status: 1 });
sessionSchema.index({ mentorID: 1, status: 1 });
sessionSchema.index({ scheduledDate: 1, status: 1 });
sessionSchema.index({ status: 1, scheduledDate: 1 });

export default mongoose.model('Session', sessionSchema);
