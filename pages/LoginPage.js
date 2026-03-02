const logger = require('../utils/logger');
const envConfig = require('../utils/envConfig');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.url = envConfig.baseUrl;

    // Selectors
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
  }

  // Locator getters

  get errorLocator() {
    return this.page.locator(this.errorMessage);
  }

  async navigate() {
    try {
      logger.info('Navigating to SauceDemo login page');
      await this.page.goto(this.url);
    } catch (error) {
      logger.error(`Failed to navigate to login page: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login with the given username and password
   */
  async login(username, password) {
    try {
      logger.info(`Logging in with user: ${username}`);
      await this.page.fill(this.usernameInput, username);
      await this.page.fill(this.passwordInput, password);
      logger.info('Clicking Login button');
      await this.page.click(this.loginButton);
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  /** Return the error message text if visible */
  async getErrorMessage() {
    try {
      const errorEl = this.page.locator(this.errorMessage);
      await errorEl.waitFor({ state: 'visible', timeout: 5000 });
      return await errorEl.textContent();
    } catch (error) {
      logger.warn('No error message found on login page');
      return null;
    }
  }
}

module.exports = LoginPage;
