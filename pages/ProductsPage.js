const logger = require('../utils/logger');

class ProductsPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = '.title';
    this.inventoryItems = '.inventory_item';
    this.itemName = '.inventory_item_name';
    this.itemPrice = '.inventory_item_price';
    this.cartBadge = '.shopping_cart_badge';
    this.cartLink = '.shopping_cart_link';
    this.sortDropdown = '[data-test="product-sort-container"]';
  }

  get titleLocator() {
    return this.page.locator(this.pageTitle);
  }

  get cartBadgeLocator() {
    return this.page.locator(this.cartBadge);
  }

  inventoryItemByName(productName) {
    return this.page.locator(this.inventoryItems).filter({ hasText: productName });
  }

  addToCartButtonByProduct(productName) {
    return this.inventoryItemByName(productName).locator('button', { hasText: 'Add to cart' });
  }

  /** Check whether the products page is displayed */
  async isVisible() {
    try {
      const title = this.page.locator(this.pageTitle);
      await title.waitFor({ state: 'visible', timeout: 10000 });
      const text = await title.textContent();
      return text.trim() === 'Products';
    } catch (error) {
      logger.error(`Products page is not visible: ${error.message}`);
      return false;
    }
  }

  /**
   * Return an array of { name, price } for every product on the page
   */
  async getAllProducts() {
    try {
      logger.info('Fetching all products');
      const items = this.page.locator(this.inventoryItems);
      const count = await items.count();
      const products = [];

      for (let i = 0; i < count; i++) {
        const name = await items.nth(i).locator(this.itemName).textContent();
        const price = await items.nth(i).locator(this.itemPrice).textContent();
        products.push({ name: name.trim(), price: price.trim() });
      }

      return products;
    } catch (error) {
      logger.error(`Failed to get products: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add a product to the cart by its name
   */
  async addToCart(productName) {
    try {
      logger.info(`Adding "${productName}" to cart`);
      await this.addToCartButtonByProduct(productName).click();
      logger.info(`"${productName}" added to cart`);
    } catch (error) {
      logger.error(`Failed to add "${productName}" to cart: ${error.message}`);
      throw error;
    }
  }

  /**
   * Return the current cart badge count (0 if badge not visible)
   */
  async getCartCount() {
    try {
      const badge = this.page.locator(this.cartBadge);
      if (await badge.isVisible()) {
        const text = await badge.textContent();
        return parseInt(text.trim(), 10);
      }
      return 0;
    } catch (error) {
      logger.warn(`Could not read cart count: ${error.message}`);
      return 0;
    }
  }

  /**
   * Select a sort option from the dropdown
   */
  async sortBy(optionText) {
    try {
      logger.info(`Sorting products by: ${optionText}`);
      await this.page.selectOption(this.sortDropdown, { label: optionText });
    } catch (error) {
      logger.error(`Failed to sort by "${optionText}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Return an array of product name strings in display order
   */
  async getProductNames() {
    try {
      const names = this.page.locator(this.itemName);
      const count = await names.count();
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push((await names.nth(i).textContent()).trim());
      }
      return result;
    } catch (error) {
      logger.error(`Failed to get product names: ${error.message}`);
      throw error;
    }
  }

  /**
   * Return an array of product prices (as numbers) in display order
   */
  async getProductPrices() {
    try {
      const prices = this.page.locator(this.itemPrice);
      const count = await prices.count();
      const result = [];
      for (let i = 0; i < count; i++) {
        const text = (await prices.nth(i).textContent()).trim();
        result.push(parseFloat(text.replace('$', '')));
      }
      return result;
    } catch (error) {
      logger.error(`Failed to get product prices: ${error.message}`);
      throw error;
    }
  }

  /** Click the cart icon to navigate to the cart page */
  async goToCart() {
    try {
      logger.info('Navigating to Cart page');
      await this.page.click(this.cartLink);
    } catch (error) {
      logger.error(`Failed to navigate to cart: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ProductsPage;
