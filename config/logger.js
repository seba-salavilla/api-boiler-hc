const log4js = require('log4js');

log4js.configure({
	appenders: {
	  	console: { type: 'console' },
	  	file: { type: 'file', filename: 'api.log' }
	},
	categories: {
		api: { appenders: ['file','console'], level: 'info' },
	  	default: { appenders: ['file', 'console'], level: 'info' }
	}
});

module.exports = log4js