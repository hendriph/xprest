const { Sequelize } = require('sequelize');
const { dbLogs } = require('@utils/logger');

const MySQL = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectMysql =  async() => {
  try {
    await MySQL.authenticate();
    await MySQL.sync();
    dbLogs.info(`MySQL connected${process.env.DB_PRIMARY == 'mysql' ? ' (Primary DB)' : ''}`);
    return MySQL;
  } catch (err) {
    dbLogs.error('MySQL connection error:', err);
  }
};

module.exports = {MySQL, connectMysql};
