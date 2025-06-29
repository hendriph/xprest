const { Sequelize } = require('sequelize');
const { dbLogs } = require('@utils/logger');

const PostgreSQL = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const connectPostgres = async () => {
  try {
    await PostgreSQL.authenticate();
    await PostgreSQL.sync();
    dbLogs.info(`PostgreSQL connected${process.env.DB_PRIMARY == 'postgresql' ? ' (Primary DB)' : ''}`);
    return PostgreSQL;
  } catch (err) {
    dbLogs.error('PostgreSQL connection error:', err);
  }
};

module.exports = {PostgreSQL, connectPostgres};
