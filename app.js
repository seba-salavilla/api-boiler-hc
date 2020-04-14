//IMPORT FROM EXPRESS GENERATOR
var createError = require('http-errors');
var express = require('express');

const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const log4js = require('./config/logger')
const {getIp} = require('./config/utils')

const privateRoutes = require('./routes')
const loginRoutes  = require('./routes/public/login')
var sse = require('./services/sse')
const Guard = require('./config/guard')

/**
 * Create Express server.
 */
var app = express();

app
.disable('etag')
.disable('x-powered-by')
.use(methodOverride('X-HTTP-Method-Override'))
.use(cors())
.use(compression())
.use(log4js.connectLogger(log4js.getLogger("api"), { level: 'auto'}))
.use(bodyParser.json({ limit: '16mb' }))
.use(bodyParser.urlencoded({ extended: true }))
.use(getIp)

app.use('/favicon.ico', function(req, res, next) {
	return res.sendStatus(204);
});

app.get('/api', function(req, res, next) {
  res.send('API-EXPRESS PUBLIC ROUTE')
})
app.use('/api/login', loginRoutes) //PUBLIC ROUTES FOR LOGIN
app.use('/api/stream', sse.init) //SERVER SEND EVENT SSE CONFIGURATION
app.use('/api/private', Guard.ShieldRoute, privateRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  //let error = process.env.NODE_ENV === 'dev' ? err.stack : {};
  let status = err.status || 500
  res.status(status).json({success:false, message: `Error ${status} solicitud no disponible`});
});

module.exports = app;
