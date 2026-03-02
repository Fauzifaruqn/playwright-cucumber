const reporter = require('multiple-cucumber-html-reporter');
const path = require('path');
const envConfig = require('./utils/envConfig');

reporter.generate({
  jsonDir: path.resolve('reports'),
  reportPath: path.resolve('reports/html'),
  reportName: 'SauceDemo Test Report',
  pageTitle: 'SauceDemo Cucumber Report',
  displayDuration: true,
  displayReportTime: true,
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    device: 'Local Machine',
    platform: { name: process.platform, version: '' },
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'SauceDemo E2E' },
      { label: 'Environment', value: envConfig.env },
      { label: 'Date', value: new Date().toLocaleString() },
    ],
  },
});

console.log('HTML report generated at reports/html/index.html');
