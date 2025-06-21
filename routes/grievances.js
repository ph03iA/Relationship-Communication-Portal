const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Grievance = require('../models/Grievance');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @route   GET api/grievances
// @desc    Get all grievances with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, severity, status, search, partnerOnly } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    
    // Filter by partner relationship if requested
    if (partnerOnly === 'true') {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = await User.findById(decoded.user.id);
          if (user && user.partner) {
            filter.$or = [
              { user: user._id },
              { user: user.partner }
            ];
          }
        } catch (err) {
          // Token invalid, continue without partner filter
        }
      }
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    const grievances = await Grievance.find(filter)
      .populate('user', 'username avatar')
      .populate('partner', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json({ grievances });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/grievances/partner
// @desc    Get grievances between partners
// @access  Private
router.get('/partner', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.partner) {
      return res.status(404).json({ msg: 'No partner linked' });
    }
    
    const grievances = await Grievance.find({
      $or: [
        { user: user._id },
        { user: user.partner }
      ]
    })
    .populate('user', 'username avatar')
    .populate('partner', 'username avatar')
    .populate('comments.user', 'username avatar')
    .sort({ createdAt: -1 });
    
    res.json({ grievances });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/grievances/:id
// @desc    Get grievance by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('user', 'username avatar bio')
      .populate('partner', 'username avatar bio')
      .populate('comments.user', 'username avatar')
      .populate('likes', 'username avatar');
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grievances
// @desc    Create a grievance
// @access  Private
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').isIn(['Communication', 'Attention', 'Jealousy', 'Laziness', 'Messiness', 'Gaming', 'Social Media', 'Other']),
  check('severity', 'Severity is required').isIn(['Low', 'Medium', 'High', 'Critical']),
  check('boyfriendName', 'Boyfriend name is required').not().isEmpty(),
  check('relationshipDuration', 'Relationship duration is required').isIn(['Less than 6 months', '6 months - 1 year', '1-2 years', '2-5 years', 'More than 5 years'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const user = await User.findById(req.user.id);
    
    const newGrievance = new Grievance({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      severity: req.body.severity,
      boyfriendName: req.body.boyfriendName,
      relationshipDuration: req.body.relationshipDuration,
      evidence: req.body.evidence || [],
      isAnonymous: req.body.isAnonymous || false,
      tags: req.body.tags || [],
      partner: user.partner || null,
      isPartnerGrievance: !!user.partner
    });
    
    const grievance = await newGrievance.save();
    
    // Update user's grievance count
    await User.findByIdAndUpdate(req.user.id, { $inc: { grievancesSubmitted: 1 } });
    
    // Populate user info before sending response
    await grievance.populate('user', 'username avatar');
    await grievance.populate('partner', 'username avatar');
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/grievances/:id
// @desc    Update a grievance
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    // Check if user owns the grievance or is the partner
    const user = await User.findById(req.user.id);
    if (grievance.user.toString() !== req.user.id && 
        (!user.partner || grievance.user.toString() !== user.partner.toString())) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update fields
    const { title, description, category, severity, status, boyfriendName, relationshipDuration, evidence, tags, comments, partnerResponse } = req.body;
    
    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;
    if (severity) grievance.severity = severity;
    if (status) grievance.status = status;
    if (boyfriendName) grievance.boyfriendName = boyfriendName;
    if (relationshipDuration) grievance.relationshipDuration = relationshipDuration;
    if (evidence) grievance.evidence = evidence;
    if (tags) grievance.tags = tags;
    if (comments) grievance.comments = comments;
    
    // Handle partner response
    if (partnerResponse && user.partner && grievance.user.toString() === user.partner.toString()) {
      grievance.partnerResponse = {
        text: partnerResponse,
        date: new Date(),
        isRead: false
      };
      grievance.communicationStatus = 'Responded';
    }
    
    await grievance.save();
    
    // Populate user info before sending response
    await grievance.populate('user', 'username avatar');
    await grievance.populate('partner', 'username avatar');
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/grievances/:id
// @desc    Delete a grievance
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    // Check if user owns the grievance
    if (grievance.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await grievance.remove();
    
    // Update user's grievance count
    await User.findByIdAndUpdate(req.user.id, { $inc: { grievancesSubmitted: -1 } });
    
    res.json({ msg: 'Grievance removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grievances/:id/like
// @desc    Like/Unlike a grievance
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    const likeIndex = grievance.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      grievance.likes.splice(likeIndex, 1);
    } else {
      grievance.likes.push(req.user.id);
    }
    
    await grievance.save();
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grievances/:id/comment
// @desc    Add comment to grievance
// @access  Private
router.post('/:id/comment', [
  auth,
  check('text', 'Comment text is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    const user = await User.findById(req.user.id);
    const isPartnerComment = user.partner && grievance.user.toString() === user.partner.toString();
    
    const newComment = {
      user: req.user.id,
      text: req.body.text,
      isPartnerComment
    };
    
    grievance.comments.unshift(newComment);
    await grievance.save();
    
    // Populate user info before sending response
    await grievance.populate('user', 'username avatar');
    await grievance.populate('partner', 'username avatar');
    await grievance.populate('comments.user', 'username avatar');
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/grievances/:id/partner-response
// @desc    Add partner response to grievance
// @access  Private
router.post('/:id/partner-response', [
  auth,
  check('response', 'Response text is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if user is the partner of the grievance author
    if (!user.partner || grievance.user.toString() !== user.partner.toString()) {
      return res.status(401).json({ msg: 'Not authorized to respond to this grievance' });
    }
    
    grievance.partnerResponse = {
      text: req.body.response,
      date: new Date(),
      isRead: false
    };
    
    grievance.communicationStatus = 'Responded';
    
    await grievance.save();
    
    // Populate user info before sending response
    await grievance.populate('user', 'username avatar');
    await grievance.populate('partner', 'username avatar');
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/grievances/:id/mark-read
// @desc    Mark partner response as read
// @access  Private
router.put('/:id/mark-read', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }
    
    // Check if user owns the grievance
    if (grievance.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    if (grievance.partnerResponse) {
      grievance.partnerResponse.isRead = true;
      await grievance.save();
    }
    
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 