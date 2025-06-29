const { DataTypes } = require('sequelize');
const {PostgreSQL} = require('../config/database/postgres');

const Authentication = PostgreSQL.define('AuthenticationPG', {
  email: {
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  refreshToken: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: 'Authentications'
});

module.exports = Authentication;