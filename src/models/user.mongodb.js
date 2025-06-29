const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fullname: { type: String, required: true },
  phone: String,
  address: String,
  role: { type: mongoose.Types.ObjectId, ref: 'Roles' }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Users', userSchema, 'Users');