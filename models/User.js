const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  relationshipStatus: {
    type: String,
    enum: ['Single', 'In a Relationship', 'Married', 'It\'s Complicated'],
    default: 'Single'
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  partnerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  relationshipStartDate: {
    type: Date,
    default: null
  },
  communicationPreferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['Public', 'Partner Only', 'Private'],
      default: 'Partner Only'
    },
    allowPartnerResponses: {
      type: Boolean,
      default: true
    }
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  grievancesSubmitted: {
    type: Number,
    default: 0
  },
  grievancesResolved: {
    type: Number,
    default: 0
  },
  karma: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['Public', 'Friends Only', 'Private'],
      default: 'Public'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 