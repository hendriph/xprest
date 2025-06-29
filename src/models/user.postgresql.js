const { DataTypes } = require('sequelize');
const {PostgreSQL} = require('../config/database/postgres');

const Role = require('./role.pg');

const User = PostgreSQL.define('User', {
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