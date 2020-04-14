const Redis = require("ioredis");
const config = require('../config')
const logger = require('../config/logger').getLogger('api')

var confredis = {
    host: config.REDIS_HOST,
    /**
     * FOR CLUSTER CONFIGURATION
     */
    /*sentinels: [
        { host: "10.0.0.223", port: 26379 },
        { host: "10.0.0.224", port: 26380 },
        { host: "10.0.0.225", port: 26380 }
    ],
    name: "mymaster",*/

    maxRetriesPerRequest: null,
    retryStrategy: function(times) {
        logger.warn("REDIS DISCONNECTED, RECONECTANDO...TIMES: "+times)
        var delay = Math.min(times * 50, 2000);
        return delay;
    }
}

class RedisInstance{
    constructor(){
        if(!this.instance){
            this.instance = this
        }
        
        this.sub = new Redis(confredis);
        this.sub.subscribe('micanal', function (err, count) {
            if(err){
                logger.fatal("ERROR AL CONECTAR A REDIS", err)
                return
            }
            logger.info(`Subscrito a ${count} canales`)
        })

        //EVENTS REDIS
        this.sub.on('error', function (err) {
            logger.error("HUBO UN ERROR EN REDIS", err)
        })
        
        this.sub.on('end', function (i) {
            logger.fatal("REDIS END", i)
        })
        this.sub.on('connect', function () {
            logger.info("CONECTADO A REDIS")
        })
    }

}

const redisInstance = new RedisInstance()
module.exports = redisInstance