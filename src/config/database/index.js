const {connectMongo} = require('./mongodb');
const {connectMysql} = require('./mysql');
const {connectPostgres} = require('./postgresql');

const initDatabases = async () => {
  const db = {};

  if (process.env.USE_MONGODB === 'true') {
    db.mongodb = await connectMongo();
  }

  if (process.env.USE_MYSQL === 'true') {
    db.mysql = await connectMysql();
  }

  if (process.env.USE_POSTGRESQL === 'true') {
    db.postgresql = await connectPostgres();
  }

  db.primary = (process.env.DB_PRIMARY === 'mysql' && db.mysql) || (process.env.DB_PRIMARY === 'postgresql' && db.postgresql || (process.env.DB_PRIMARY === 'mongodb' && db.mongodb)) || null;

  return db;
};

module.exports = initDatabases;
