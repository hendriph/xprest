const { DataTypes } = require('sequelize');
const {MySQL} = require('../config/database/mysql');

const Authentication = MySQL.define('Authentication', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.TEXT
  }
}, { 
  tableName: 'Authentications' 
});

module.exports = Authentication;
