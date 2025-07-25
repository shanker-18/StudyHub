import Request from '../models/Request.js';
import User from '../models/User.js';

export const createRequest = async (req, res) => {
  try {
    const { toMentorID, subject, message, skills, preferredSchedule } = req.body;
    const { dbUser } = req.user;

    const newRequest = new Request({
      fromUserID: dbUser._id,
      toMentorID,
      subject,
      message,
      skills: skills || [],
      preferredSchedule
    });

    const savedRequest = await newRequest.save();
    const populatedRequest = await Request.findById(savedRequest._id)
      .populate('fromUserID', 'name email avatarURL')
      .populate('toMentorID', 'name email avatarURL');

    res.status(201).json({
      message: 'Request sent successfully',
      request: populatedRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

export const getRequestsForMentor = async (req, res) => {
  try {
    const { dbUser } = req.user;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { toMentorID: dbUser._id };
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate('fromUserID', 'name email avatarURL')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get mentor requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getRequestsFromLearner = async (req, res) => {
  try {
    const { dbUser } = req.user;
    const requests = await Request.find({ fromUserID: dbUser._id })
      .populate('toMentorID', 'name email avatarURL')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get learner requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id)
      .populate('fromUserID', 'name email avatarURL')
      .populate('toMentorID', 'name email avatarURL');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;

    const request = await Request.findByIdAndUpdate(
      id,
      {
        status: 'accepted',
        responseMessage,
        respondedAt: new Date()
      },
      { new: true }
    ).populate('fromUserID toMentorID');

    res.json({
      message: 'Request accepted',
      request
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

export const declineRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;

    const request = await Request.findByIdAndUpdate(
      id,
      {
        status: 'declined',
        responseMessage,
        respondedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Request declined',
      request
    });
  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({ error: 'Failed to decline request' });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({
      message: 'Request cancelled',
      request
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const request = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'Request updated',
      request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};
