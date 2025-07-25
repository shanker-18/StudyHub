import Session from '../models/Session.js';
import Request from '../models/Request.js';

export const createSession = async (req, res) => {
  try {
    const { requestID, title, description, scheduledDate, duration } = req.body;
    const { dbUser } = req.user;

    // Get the request to find mentor and learner
    const request = await Request.findById(requestID);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const newSession = new Session({
      learnerID: request.fromUserID,
      mentorID: request.toMentorID,
      requestID,
      title,
      description,
      scheduledDate,
      duration
    });

    const savedSession = await newSession.save();
    res.status(201).json({
      message: 'Session created successfully',
      session: savedSession
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const { dbUser } = req.user;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { learnerID: dbUser._id },
        { mentorID: dbUser._id }
      ]
    };

    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate('learnerID', 'name email avatarURL')
      .populate('mentorID', 'name email avatarURL')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate('learnerID', 'name email avatarURL')
      .populate('mentorID', 'name email avatarURL');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const session = await Session.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Session updated',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
};

export const updateSessionNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const { dbUser } = req.user;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Determine if user is mentor or learner
    const userRole = session.mentorID.toString() === dbUser._id.toString() ? 'mentor' : 'learner';
    
    const updateField = `notes.${userRole}`;
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { [updateField]: notes },
      { new: true }
    );

    res.json({
      message: 'Notes updated',
      session: updatedSession
    });
  } catch (error) {
    console.error('Update session notes error:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
};

export const addSessionFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const { dbUser } = req.user;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Determine if user is mentor or learner
    const isMentor = session.mentorID.toString() === dbUser._id.toString();
    const ratingField = isMentor ? 'feedback.mentorRating' : 'feedback.learnerRating';
    const commentField = isMentor ? 'feedback.mentorComment' : 'feedback.learnerComment';

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      {
        [ratingField]: rating,
        [commentField]: comment
      },
      { new: true }
    );

    res.json({
      message: 'Feedback added',
      session: updatedSession
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({
      message: 'Session cancelled',
      session
    });
  } catch (error) {
    console.error('Cancel session error:', error);
    res.status(500).json({ error: 'Failed to cancel session' });
  }
};

export const markSessionComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(
      id,
      { 
        status: 'completed',
        actualEndTime: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Session marked as complete',
      session
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
};
