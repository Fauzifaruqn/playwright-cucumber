const os = require('os');

// Use half the CPU cores for parallel, minimum 1
const workers = Math.max(1, Math.floor(os.cpus().length / 2));

module.exports = {
  default: {
    require: [
      'features/support/**/*.js',
      'features/step_definitions/**/*.js',
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    publishQuiet: true,
    parallel: workers,
  },
};
