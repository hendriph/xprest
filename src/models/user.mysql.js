const { DataTypes } = require('sequelize');
const {MySQL} = require('../config/database/mysql');

const Role = require('./role.mysql');

const User = MySQL.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  role_id: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  }
}, {
  tableName: 'Users'
});

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

module.exports = User;