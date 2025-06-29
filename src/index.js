require('module-alias/register');
const app = require('./app');
const http = require('http');
const { createLogger, any } = require('@utils/logger');
const initDatabases = require('@config/database');
const debug = createLogger('xprest:server');

// ✅ Catch fatal & async errors (MUST be set early)
process.on('uncaughtException', (err) => {
  any.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1); // boleh remove kalau kamu mau biar tetap hidup
});

process.on('unhandledRejection', (reason, promise) => {
  any.error(`Unhandled Rejection: ${reason instanceof Error ? reason.message : reason}`);
});

const PORT = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

initDatabases().then(() => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(PORT, () => {
    debug.info(`Server running...`);
  });
  server.on('error', onError);
  server.on('listening', onListening);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      any.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      any.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug.info('Listening on ' + bind);
}
