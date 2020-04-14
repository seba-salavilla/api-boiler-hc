//const RedisCli = require('./redis')
const EventEmitter = require('events').EventEmitter;

/**
 * Server-Sent Event instance class
 * @extends EventEmitter
 */
class SSE extends EventEmitter {
  /**
   * Creates a new Server-Sent Event instance
   */
  constructor() {
    super();

    this.init = this.init.bind(this);
  }

  /**
   * MIDLEWARE FOR EXPRESS
   * The SSE route handler
   */
  init(req, res) {
    console.log("NEW SSE CLIENT!")
    let id = 0;
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    res.statusCode = 200;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');//FOR NGINX

    if (req.httpVersion !== '2.0') {
        console.log("keep-alive")
        res.setHeader('Connection', 'keep-alive');
    }
    
    /*if (this.options.isCompressed) {
        res.setHeader('Content-Encoding', 'deflate');
    }*/

    res.write(':ok\n\n');
    res.flush()

    // Increase number of event listeners on init
    this.setMaxListeners(this.getMaxListeners() + 2);

    const dataListener = data => {
      res.write(`id: ${id++}\n`);
      res.write(`event: ${data.event}\n`);
      res.write(`data: ${data.data}\n\n`);

      res.flush()
    };

    this.on('data', dataListener);

    // Remove listeners and reduce the number of max listeners on client disconnect
    req.on('close', () => {
      console.log("CLOSE CONNECTION")
      this.removeListener('data', dataListener);
      this.setMaxListeners(this.getMaxListeners() - 2);
    });
  }

  /**
   * Update the data initially served by the SSE stream
   * @param {array} data array containing data to be served on new connections
   */
  updateInit(data) {
    this.initial = Array.isArray(data) ? data : [data];
  }

  /**
   * Empty the data initially served by the SSE stream
   */
  dropInit() {
    this.initial = [];
  }

  /**
   * Send data to the SSE
   * @param {(object|string)} data Data to send into the stream
   * @param [string] event Event name
   * @param [(string|number)] id Custom event ID
   */
  send(data, event) {
    this.emit('data', { data, event});
  }

  /**
   * Send serialized data to the SSE
   * @param {array} data Data to be serialized as a series of events
   */
  serialize(data) {
    if (Array.isArray(data)) {
      this.emit('serialize', data);
    } else {
      this.send(data);
    }
  }
}

var sse = new SSE();

/*RedisCli.sub.on("message",(channel, message) => {
    sse.send(message, channel)
})*/

module.exports = sse;
