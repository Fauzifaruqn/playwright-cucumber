const { When, Then } = require('@cucumber/cucumber');

const ProductsPage = require('../../pages/ProductsPage');
const CartPage = require('../../pages/CartPage');
const Assert = require('../../utils/assert');
const logger = require('../../utils/logger');

When('I navigate to the Cart page', async function () {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  await this.productsPage.goToCart();
  this.cartPage = new CartPage(this.page);
});

Then(
  'I verify buttons Remove, Checkout and Continue are enabled',
  async function () {
    this.cartPage = this.cartPage || new CartPage(this.page);
    await Assert.enabled(this.cartPage.removeButtonLocator, 'Remove button should be enabled');
    await Assert.enabled(this.cartPage.checkoutButtonLocator, 'Checkout button should be enabled');
    await Assert.enabled(this.cartPage.continueButtonLocator, 'Continue Shopping button should be enabled');
  }
);

When('I remove the product', async function () {
  this.cartPage = this.cartPage || new CartPage(this.page);
  await this.cartPage.removeItem();
});

Then('I verify the cart is empty', async function () {
  this.cartPage = this.cartPage || new CartPage(this.page);
  await Assert.notVisible(this.cartPage.cartBadgeLocator, 'Cart badge should not be visible');
  await Assert.hasCount(this.cartPage.cartItemsLocator, 0, 'Cart should have 0 items');
  logger.info('Cart is confirmed empty');
});


When('I click Continue Shopping', async function () {
  this.cartPage = this.cartPage || new CartPage(this.page);
  await this.cartPage.clickContinueShopping();
});


When('I click Checkout', async function () {
  this.cartPage = this.cartPage || new CartPage(this.page);
  await this.cartPage.clickCheckout();
});
