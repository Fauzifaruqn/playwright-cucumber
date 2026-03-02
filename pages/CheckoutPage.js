const logger = require('../utils/logger');

class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.zipCodeInput = '[data-test="postalCode"]';
    this.continueButton = '[data-test="continue"]';
    this.cancelButton = '[data-test="cancel"]';
    this.checkoutError = '[data-test="error"]';

    this.overviewTitle = '.title';
    this.summaryInfo = '.summary_info';
    this.finishButton = '[data-test="finish"]';

    this.completeHeader = '.complete-header';
    this.completeText = '.complete-text';
    this.backHomeButton = '[data-test="back-to-products"]';
  }

  get titleLocator() { return this.page.locator(this.overviewTitle); }
  get completeHeaderLocator() { return this.page.locator(this.completeHeader); }
  get errorLocator() { return this.page.locator(this.checkoutError); }


  async fillInformation(firstName, lastName, zip) {
    try {
      logger.info(`Filling checkout info: ${firstName} ${lastName}, ${zip}`);
      await this.page.fill(this.firstNameInput, firstName);
      await this.page.fill(this.lastNameInput, lastName);
      await this.page.fill(this.zipCodeInput, zip);
    } catch (error) {
      logger.error(`Failed to fill checkout info: ${error.message}`);
      throw error;
    }
  }

  /** Click Continue on step-one form */
  async clickContinue() {
    try {
      logger.info('Clicking Continue on checkout form');
      await this.page.click(this.continueButton);
    } catch (error) {
      logger.error(`Failed to click Continue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify the checkout overview page is displayed
   */
  async isOverviewVisible() {
    try {
      const title = this.page.locator(this.overviewTitle);
      await title.waitFor({ state: 'visible', timeout: 5000 });
      const text = await title.textContent();
      const visible = text.trim() === 'Checkout: Overview';
      logger.info(`Checkout overview visible: ${visible}`);
      return visible;
    } catch (error) {
      logger.error(`Overview page not visible: ${error.message}`);
      return false;
    }
  }

  /** Click the Finish button on overview page */
  async clickFinish() {
    try {
      logger.info('Clicking Finish');
      await this.page.click(this.finishButton);
    } catch (error) {
      logger.error(`Failed to click Finish: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify the order-complete confirmation is displayed
   */
  async isOrderConfirmationVisible() {
    try {
      const header = this.page.locator(this.completeHeader);
      await header.waitFor({ state: 'visible', timeout: 5000 });
      const text = await header.textContent();
      const visible = text.trim() === 'Thank you for your order!';
      logger.info(`Order confirmation visible: ${visible}`);
      return visible;
    } catch (error) {
      logger.error(`Order confirmation not visible: ${error.message}`);
      return false;
    }
  }

  /**
   * Return the checkout error message text (step-one validation)
   */
  async getErrorMessage() {
    try {
      const errorEl = this.page.locator(this.checkoutError);
      await errorEl.waitFor({ state: 'visible', timeout: 5000 });
      return await errorEl.textContent();
    } catch (error) {
      logger.warn('No checkout error message found');
      return null;
    }
  }
}

module.exports = CheckoutPage;
