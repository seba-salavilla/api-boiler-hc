const dotenv = require('dotenv');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

const config = {
    REDIS_HOST:process.env.REDIS_HOST,
    PORT: process.env.API_PORT,
    ENV: process.env.NODE_ENV === 'dev' || 'prod',
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_DB: process.env.MONGO_DB,
    TOKEN_KEY: process.env.KEY_TOKEN,
};

module.exports = config;