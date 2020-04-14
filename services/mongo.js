const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config')
const logger = require('../config/logger').getLogger('api')
const Tables = require('../config/tables.json')

const options = { 
    reconnectTries: 99999, 
    reconnectInterval: 4000, 
    autoReconnect:true, 
    useNewUrlParser: true, 
    bufferMaxEntries: 0,
    useUnifiedTopology: true,
    //CONFIGURE AUTH  ACCESS MONGO
    /*auth:{
        user:"root",
        password:"123"
    }*/
}

var db
const url = 'mongodb://'+config.MONGO_HOST;

module.exports = {
    connect: (cb) => {
        try {
            MongoClient.connect(url,options, async (err, mongodb) => {
                if(err){
                    logger.error('MongoDB connection error. '+err.message);
                    return cb(false)
                }
                logger.info('MongoDB Connected. ', url)
                db = mongodb.db(config.MONGO_DB);

                cb(true)
            });
            
                     
        }catch (err) {
            logger.error('Error: '+err)
            cb(false)
        }           
    },
    collections: ( name ) => {
        return db.collection( name );
    },
    
    ObjectID,
    Tables
};
  