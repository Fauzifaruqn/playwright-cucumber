const logger = require('../utils/logger');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = '.cart_item';
    this.cartQuantity = '.cart_quantity';
    this.cartDescription = '.inventory_item_name';
    this.removeButton = 'button[data-test^="remove"]';
    this.checkoutButton = '[data-test="checkout"]';
    this.continueShoppingButton = '[data-test="continue-shopping"]';
    this.cartBadge = '.shopping_cart_badge';
  }
  get cartItemsLocator() { return this.page.locator(this.cartItems); }
  get cartBadgeLocator() { return this.page.locator(this.cartBadge); }
  get removeButtonLocator() { return this.page.locator(this.removeButton).first(); }
  get checkoutButtonLocator() { return this.page.locator(this.checkoutButton); }
  get continueButtonLocator() { return this.page.locator(this.continueShoppingButton); }

  /**
   * Verify that Remove, Checkout and Continue Shopping buttons are enabled
   */
  async verifyButtonsEnabled() {
    try {
      logger.info('Verifying cart page buttons are enabled');

      const removeBtn = this.page.locator(this.removeButton).first();
      const checkoutBtn = this.page.locator(this.checkoutButton);
      const continueBtn = this.page.locator(this.continueShoppingButton);

      const removeEnabled = await removeBtn.isEnabled();
      const checkoutEnabled = await checkoutBtn.isEnabled();
      const continueEnabled = await continueBtn.isEnabled();

      logger.info(
        `Buttons — Remove: ${removeEnabled}, Checkout: ${checkoutEnabled}, Continue: ${continueEnabled}`
      );

      return removeEnabled && checkoutEnabled && continueEnabled;
    } catch (error) {
      logger.error(`Button verification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove the first item from the cart
   */
  async removeItem() {
    try {
      logger.info('Removing first item from cart');
      const removeBtn = this.page.locator(this.removeButton).first();
      await removeBtn.click();
      logger.info('Item removed from cart');
    } catch (error) {
      logger.error(`Failed to remove item: ${error.message}`);
      throw error;
    }
  }

  /**
   * Return the number of items currently in the cart page list
   */
  async getItemCount() {
    try {
      const count = await this.page.locator(this.cartItems).count();
      logger.info(`Cart contains ${count} item(s)`);
      return count;
    } catch (error) {
      logger.error(`Failed to get cart item count: ${error.message}`);
      throw error;
    }
  }

  /** Click the Checkout button */
  async clickCheckout() {
    try {
      logger.info('Clicking Checkout button');
      await this.page.click(this.checkoutButton);
    } catch (error) {
      logger.error(`Failed to click Checkout: ${error.message}`);
      throw error;
    }
  }

  /** Click the Continue Shopping button */
  async clickContinueShopping() {
    try {
      logger.info('Clicking Continue Shopping button');
      await this.page.click(this.continueShoppingButton);
    } catch (error) {
      logger.error(`Failed to click Continue Shopping: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check whether the cart badge is gone (i.e. cart is empty)
   */
  async isCartEmpty() {
    try {
      const badge = this.page.locator(this.cartBadge);
      const visible = await badge.isVisible();
      const items = await this.getItemCount();
      const empty = !visible && items === 0;
      logger.info(`Cart empty: ${empty}`);
      return empty;
    } catch (error) {
      logger.error(`Failed to check if cart is empty: ${error.message}`);
      throw error;
    }
  }
}

module.exports = CartPage;
