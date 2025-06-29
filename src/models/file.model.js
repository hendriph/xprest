
// MySQL
const { DataTypes } = require('sequelize');
const {MySQL} = require('../config/database/mysql');

const File = MySQL.define('File', {
  filename: DataTypes.STRING,
  originalname: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,
  path: DataTypes.STRING,
  storage: DataTypes.STRING,
  user_id: DataTypes.INTEGER
}, {
  tableName: 'Files',
  timestamps: true
});

module.exports = File;

// PostgreSQL
// const { DataTypes } = require('sequelize');
// const {PostgreSQL} = require('../config/database/postgres');

// const File = PostgreSQL.define('File', {
//   filename: DataTypes.STRING,
//   originalname: DataTypes.STRING,
//   mimetype: DataTypes.STRING,
//   size: DataTypes.INTEGER,
//   path: DataTypes.STRING,
//   storage: DataTypes.STRING,
//   user_id: DataTypes.INTEGER
// }, {
//   tableName: 'Files',
//   timestamps: true
// });

// module.exports = File;

// MongoDB
// const mongoose = require('mongoose');

// const fileSchema = new mongoose.Schema({
//   filename: String,
//   originalname: String,
//   mimetype: String,
//   size: Number,
//   path: String,
//   storage: String,
//   user_id: mongoose.Types.ObjectId
// }, {
//   timestamps: true,
//   versionKey: false
// });

// module.exports = mongoose.model('File', fileSchema, 'Files');