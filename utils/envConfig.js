require('dotenv').config();
const path = require('path');

const env = process.env.ENV || 'staging';
const dataPath = path.resolve(__dirname, '..', 'data', `${env}.json`);

// Load and cache the environment data
const envData = require(dataPath);

module.exports = {
  env,

  baseUrl: envData.base_url,
  standardUser: envData.standard_user,
  lockedOutUser: envData.locked_out_user,

  /** Whether to launch the browser in headed mode */
  headed: process.env.HEADED === 'true',
};
