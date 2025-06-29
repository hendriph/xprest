const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  refreshToken: { 
    type: String, 
    default: null 
  }
}, {
  timestamps: true, // automation generate createdAt dan updatedAt
  versionKey: false
});

module.exports = mongoose.model('Authentications', authSchema, 'Authentications');
