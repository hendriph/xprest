const { DataTypes } = require('sequelize');
const {PostgreSQL} = require('../config/database/postgres');

const Role = PostgreSQL.define('Role', {
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