const debug = require('debug');
const winston = require('winston');
require('winston-daily-rotate-file');

const isProd = process.env.NODE_ENV === 'production';

// Transports: log ke console, error.log & combined.log (rotated daily)
const transports = [
  new winston.transports.Console(),

  new winston.transports.DailyRotateFile({
    filename: 'storages/logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    zippedArchive: false,
    maxSize: '10m',
    maxFiles: '14d'
  }),

  new winston.transports.DailyRotateFile({
    filename: 'storages/logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '10m',
    maxFiles: '14d',
    level: 'info'
  })
];

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`
      }
    )
  ),
  transports
});

const createLogger = (namespace) => {
  const debugLog = debug(namespace);

  const log = (level) => (msg) => {
    if (isProd) {
      winstonLogger.log({ level, message: `[${namespace}] ${msg}` });
    } else {
      debugLog(`[${level.toUpperCase()}] ${msg}`);
    }
  };

  return {
    info: log('info'),
    warn: log('warn'),
    error: log('error')
  };
};

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'storages/logs/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '10m',
      maxFiles: '30d'
    })
  ]
});

module.exports = {
  createLogger,
  auditLogger,
  routesLogs: createLogger('xprest:routes'),
  authLogs: createLogger('xprest:auth'),
  dbLogs: createLogger('xprest:db'),
  httpLogs: createLogger('xprest:http'),
  middlewareLogs: createLogger('xprest:middleware'),
  uploadLogs: createLogger('xprest:upload'),
  any: createLogger('xprest:any')
};
