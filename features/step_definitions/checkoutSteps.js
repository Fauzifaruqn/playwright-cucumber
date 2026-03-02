const { When, Then } = require('@cucumber/cucumber');

const CheckoutPage = require('../../pages/CheckoutPage');
const Assert = require('../../utils/assert');
const logger = require('../../utils/logger');


When(
  'I fill checkout information with first name {string} last name {string} and zip {string}',
  async function (firstName, lastName, zip) {
    this.checkoutPage = new CheckoutPage(this.page);
    await this.checkoutPage.fillInformation(firstName, lastName, zip);
  }
);

// Click Continue (checkout step-one → overview)

When('I click Continue', async function () {
  this.checkoutPage = this.checkoutPage || new CheckoutPage(this.page);
  await this.checkoutPage.clickContinue();
});

// Overview visible

Then('I verify the checkout overview is displayed', async function () {
  this.checkoutPage = this.checkoutPage || new CheckoutPage(this.page);
  await Assert.textEquals(this.checkoutPage.titleLocator, 'Checkout: Overview', 'Checkout overview should be displayed');
});

// Finish order

When('I click Finish', async function () {
  this.checkoutPage = this.checkoutPage || new CheckoutPage(this.page);
  await this.checkoutPage.clickFinish();
});

// Order confirmation

Then('I verify the order confirmation is displayed', async function () {
  this.checkoutPage = this.checkoutPage || new CheckoutPage(this.page);
  await Assert.textEquals(this.checkoutPage.completeHeaderLocator, 'Thank you for your order!', 'Order confirmation should be displayed');
  logger.info('Order confirmation page verified');
});

// Checkout validation error

Then('I should see the checkout error {string}', async function (expected) {
  this.checkoutPage = this.checkoutPage || new CheckoutPage(this.page);
  await Assert.textEquals(this.checkoutPage.errorLocator, expected, `Checkout error should be: "${expected}"`);
});
