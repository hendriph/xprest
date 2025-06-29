const { DataTypes } = require('sequelize');
const {MySQL} = require('../config/database/mysql');

const Role = MySQL.define('Role', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Roles'
});

module.exports = Role;