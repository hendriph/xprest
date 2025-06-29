const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true, // automation generate createdAt dan updatedAt
  versionKey: false
});

module.exports = mongoose.model('Roles', roleSchema, 'Roles');
