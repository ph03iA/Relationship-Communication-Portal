const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { username, email, password, relationshipStatus } = req.body;
  
  try {
    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    user = new User({
      username,
      email,
      password,
      relationshipStatus: relationshipStatus || 'Single'
    });
    
    await user.save();
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio, relationshipStatus, avatar, preferences, communicationPreferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (relationshipStatus) user.relationshipStatus = relationshipStatus;
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (communicationPreferences) user.communicationPreferences = { ...user.communicationPreferences, ...communicationPreferences };
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/link-partner
// @desc    Link partner by email
// @access  Private
router.post('/link-partner', [
  auth,
  check('partnerEmail', 'Partner email is required').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { partnerEmail } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if partner exists
    const partner = await User.findOne({ email: partnerEmail });
    
    if (!partner) {
      return res.status(404).json({ msg: 'Partner not found. They need to register first.' });
    }
    
    // Check if already linked
    if (user.partner && user.partner.toString() === partner._id.toString()) {
      return res.status(400).json({ msg: 'Already linked with this partner' });
    }
    
    // Link both users
    user.partner = partner._id;
    user.partnerEmail = partnerEmail;
    user.relationshipStatus = 'In a Relationship';
    user.relationshipStartDate = new Date();
    
    partner.partner = user._id;
    partner.partnerEmail = user.email;
    partner.relationshipStatus = 'In a Relationship';
    partner.relationshipStartDate = new Date();
    
    await user.save();
    await partner.save();
    
    res.json({ 
      msg: 'Partner linked successfully!',
      partner: {
        id: partner._id,
        username: partner.username,
        email: partner.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/unlink-partner
// @desc    Unlink partner
// @access  Private
router.post('/unlink-partner', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (!user.partner) {
      return res.status(400).json({ msg: 'No partner linked' });
    }
    
    // Unlink both users
    const partner = await User.findById(user.partner);
    if (partner) {
      partner.partner = null;
      partner.partnerEmail = null;
      partner.relationshipStatus = 'Single';
      partner.relationshipStartDate = null;
      await partner.save();
    }
    
    user.partner = null;
    user.partnerEmail = null;
    user.relationshipStatus = 'Single';
    user.relationshipStartDate = null;
    
    await user.save();
    
    res.json({ msg: 'Partner unlinked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/partner
// @desc    Get partner information
// @access  Private
router.get('/partner', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('partner', 'username email avatar bio relationshipStatus');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (!user.partner) {
      return res.status(404).json({ msg: 'No partner linked' });
    }
    
    res.json(user.partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const stats = {
      grievancesSubmitted: user.grievancesSubmitted,
      grievancesResolved: user.grievancesResolved,
      karma: user.karma,
      joinDate: user.joinDate,
      relationshipStatus: user.relationshipStatus,
      hasPartner: !!user.partner,
      relationshipStartDate: user.relationshipStartDate
    };
    
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 