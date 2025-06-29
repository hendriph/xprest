const mongoose = require('mongoose');
const debug = require('debug')('xprest:mongodb');
const { dbLogs } = require('@utils/logger');

const connectMongo = async () => {
  if (!process.env.MONGO_URI) {
    dbLogs.error('Mongo URI not set.');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    dbLogs.info(`MongoDB connected${process.env.DB_PRIMARY == 'mongodb' ? ' (Primary DB)' : ''}`);
    return conn;
  } catch (err) {
    dbLogs.error('MongoDB connection error:', err);
    return null;
  }
};

module.exports = {connectMongo};
