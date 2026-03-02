const { Then, When } = require('@cucumber/cucumber');

const ProductsPage = require('../../pages/ProductsPage');
const Assert = require('../../utils/assert');
const logger = require('../../utils/logger');

// Page visibility

Then('I verify the products page is visible', async function () {
  this.productsPage = new ProductsPage(this.page);
  await Assert.textEquals(this.productsPage.titleLocator, 'Products', 'Products page should be visible');
});

// List products

Then('I log all product names and prices', async function () {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  const products = await this.productsPage.getAllProducts();

  products.forEach(({ name, price }) => {
    logger.info(`Product: ${name} | Price: ${price}`);
  });

  this.products = products;
});

// Add generic first product

When('I add a product to the cart', async function () {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  const products = this.products || (await this.productsPage.getAllProducts());
  const targetProduct = products[0].name;
  logger.info(`Selecting product: ${targetProduct}`);
  await this.productsPage.addToCart(targetProduct);
});

// Add product by name

When('I add {string} to the cart', async function (productName) {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  await this.productsPage.addToCart(productName);
});

// Cart badge quantity

Then('I verify the cart quantity is {int}', async function (expectedCount) {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  if (expectedCount === 0) {
    await Assert.notVisible(this.productsPage.cartBadgeLocator, 'Cart badge should not be visible');
  } else {
    await Assert.textEquals(
      this.productsPage.cartBadgeLocator,
      String(expectedCount),
      `Cart quantity should be ${expectedCount}`
    );
  }
});

// Sorting

When('I sort products by {string}', async function (sortOption) {
  this.productsPage = this.productsPage || new ProductsPage(this.page);
  await this.productsPage.sortBy(sortOption);
});

Then('the products should be sorted by {word} in {word} order', async function (field, order) {
  this.productsPage = this.productsPage || new ProductsPage(this.page);

  if (field === 'name') {
    const names = await this.productsPage.getProductNames();
    const sorted = order === 'ascending'
      ? [...names].sort((a, b) => a.localeCompare(b))
      : [...names].sort((a, b) => b.localeCompare(a));
    Assert.deepEquals(names, sorted, `Products should be sorted by name ${order}`);
  } else {
    const prices = await this.productsPage.getProductPrices();
    const sorted = order === 'ascending'
      ? [...prices].sort((a, b) => a - b)
      : [...prices].sort((a, b) => b - a);
    Assert.deepEquals(prices, sorted, `Products should be sorted by price ${order}`);
  }
});
