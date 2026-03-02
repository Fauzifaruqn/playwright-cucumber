const { Given, When, Then } = require('@cucumber/cucumber');

const LoginPage = require('../../pages/LoginPage');
const Assert = require('../../utils/assert');
const envConfig = require('../../utils/envConfig');

// Navigation

Given('I open the SauceDemo website', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigate();
});

// Login with standard user credentials from current env

When('I login with valid credentials', async function () {
  const { username, password } = envConfig.standardUser;
  this.loginPage = this.loginPage || new LoginPage(this.page);
  await this.loginPage.login(username, password);
});

// Login with explicit username / password

When(
  'I login with username {string} and password {string}',
  async function (username, password) {
    this.loginPage = this.loginPage || new LoginPage(this.page);
    await this.loginPage.login(username, password);
  }
);

// Error assertion

Then('I should see the error message {string}', async function (expected) {
  this.loginPage = this.loginPage || new LoginPage(this.page);
  await Assert.textEquals(this.loginPage.errorLocator, expected, `Login error should be: "${expected}"`);
});
