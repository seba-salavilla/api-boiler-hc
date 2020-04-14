#!/usr/bin/env node

/**
 * Module dependencies.
 */

const config = require('./config')
var app = require('./app');
var http = require('http');
var mongodb = require('./services/mongo')
const logger = require('./config/logger').getLogger('api')


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.PORT || '3000');
app.set('host', process.env.HOST_API || '0.0.0.0');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
mongodb.connect( conn =>{
	if(conn){
		server.listen(port);
	}else{
		process.exit(0)
	}
})

server.on('error', onError);
server.on('listening', onListening);

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
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
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
  logger.info(`[PID ${process.pid}] API Listening at ${bind}`)

  //OPTIONAL
  try {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      console.log('addr: '+add);
      var url = `http://${add}:${addr.port}/api`
      var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
      require('child_process').exec(start + ' ' + url);
    })
    
  } catch (err) {
    logger.error(err)
  }
}
