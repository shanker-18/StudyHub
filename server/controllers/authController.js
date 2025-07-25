import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { name, role, bio, skills, location } = req.body;
    const { uid, email } = req.user;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already registered',
        user: existingUser 
      });
    }

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ 
        error: 'Name and role are required' 
      });
    }

    if (!['mentor', 'learner'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role must be either mentor or learner' 
      });
    }

    // Create new user
    const newUser = new User({
      uid,
      email,
      name: name.trim(),
      role,
      bio: bio?.trim() || '',
      skills: Array.isArray(skills) ? skills.map(s => s.trim()).filter(Boolean) : [],
      location: location?.trim() || ''
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user.dbUser;
    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user data' 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { dbUser } = req.user;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.uid;
    delete updateData.email;
    delete updateData.role; // Role changes should be handled separately
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate skills array
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills.map(s => s.trim()).filter(Boolean);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      dbUser._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message 
    });
  }
};
