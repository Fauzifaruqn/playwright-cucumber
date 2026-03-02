const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, message) {
  console.log(`[${formatTimestamp()}] [${level}] ${message}`);
}

const logger = {
  info: (message) => log(LOG_LEVELS.INFO, message),
  warn: (message) => log(LOG_LEVELS.WARN, message),
  error: (message) => log(LOG_LEVELS.ERROR, message),
  debug: (message) => log(LOG_LEVELS.DEBUG, message),
};

module.exports = logger;
