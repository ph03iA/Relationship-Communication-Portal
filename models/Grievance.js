const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Communication', 'Attention', 'Jealousy', 'Laziness', 'Messiness', 'Gaming', 'Social Media', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: {
    type: String,
    default: 'Open',
    enum: ['Open', 'In Progress', 'Resolved', 'Closed']
  },
  boyfriendName: {
    type: String,
    required: true,
    trim: true
  },
  relationshipDuration: {
    type: String,
    required: true,
    enum: ['Less than 6 months', '6 months - 1 year', '1-2 years', '2-5 years', 'More than 5 years']
  },
  // New fields for partner communication
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isPartnerGrievance: {
    type: Boolean,
    default: false
  },
  partnerResponse: {
    text: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    date: {
      type: Date,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  communicationStatus: {
    type: String,
    enum: ['Pending Response', 'Responded', 'Resolved', 'Escalated'],
    default: 'Pending Response'
  },
  evidence: {
    type: [String],
    default: []
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    isPartnerComment: {
      type: Boolean,
      default: false
    }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Add text index for search functionality
GrievanceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Grievance', GrievanceSchema); 