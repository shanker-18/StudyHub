import User from '../models/User.js';

export const getAllMentors = async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, location, minRating, sortBy = 'rating' } = req.query;
    const skip = (page - 1) * limit;

    let query = { 
      role: 'mentor', 
      isActive: true 
    };

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Minimum rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { rating: -1, totalSessions: -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1 };
        break;
      case 'sessions':
        sortOptions = { totalSessions: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { rating: -1, totalSessions: -1 };
    }

    const mentors = await User.find(query)
      .select('-__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      mentors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all mentors error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch mentors' 
    });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mentor = await User.findOne({ 
      _id: id, 
      role: 'mentor', 
      isActive: true 
    }).select('-__v');

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor by ID error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch mentor' 
    });
  }
};

export const searchMentors = async (req, res) => {
  try {
    const { 
      q, 
      skills, 
      location, 
      minRating, 
      maxRate,
      minExperience,
      page = 1, 
      limit = 10,
      sortBy = 'rating'
    } = req.query;
    
    const skip = (page - 1) * limit;

    let query = { 
      role: 'mentor', 
      isActive: true 
    };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Hourly rate filter
    if (maxRate) {
      query.$or = [
        { hourlyRate: { $lte: parseFloat(maxRate) } },
        { hourlyRate: 0 } // Include free mentors
      ];
    }

    // Experience filter
    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }

    // Sort options
    let sortOptions = {};
    if (q) {
      sortOptions = { score: { $meta: 'textScore' } };
    } else {
      switch (sortBy) {
        case 'rating':
          sortOptions = { rating: -1, totalSessions: -1 };
          break;
        case 'experience':
          sortOptions = { experience: -1 };
          break;
        case 'sessions':
          sortOptions = { totalSessions: -1 };
          break;
        case 'rate':
          sortOptions = { hourlyRate: 1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        default:
          sortOptions = { rating: -1, totalSessions: -1 };
      }
    }

    const mentors = await User.find(query)
      .select('-__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      mentors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search mentors error:', error);
    res.status(500).json({ 
      error: 'Failed to search mentors' 
    });
  }
};

export const getMentorsBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const mentors = await User.find({
      role: 'mentor',
      isActive: true,
      skills: { $in: [skill] }
    })
    .select('-__v')
    .sort({ rating: -1, totalSessions: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await User.countDocuments({
      role: 'mentor',
      isActive: true,
      skills: { $in: [skill] }
    });

    res.json({
      mentors,
      skill,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get mentors by skill error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch mentors by skill' 
    });
  }
};

export const getFeaturedMentors = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Featured mentors are those with high ratings and verified status
    const mentors = await User.find({
      role: 'mentor',
      isActive: true,
      rating: { $gte: 4.0 },
      totalSessions: { $gte: 5 }
    })
    .select('-__v')
    .sort({ 
      isVerified: -1,
      rating: -1, 
      totalSessions: -1 
    })
    .limit(parseInt(limit));

    res.json({
      mentors
    });
  } catch (error) {
    console.error('Get featured mentors error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch featured mentors' 
    });
  }
};
