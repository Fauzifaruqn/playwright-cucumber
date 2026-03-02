const { expect } = require('@playwright/test');
const logger = require('./logger');

const Assert = {
  /** Assert element is visible */
  async visible(locator, message = 'Element should be visible') {
    logger.info(`Assert: ${message}`);
    await expect(locator, message).toBeVisible();
  },

  /** Assert element is not visible / hidden */
  async notVisible(locator, message = 'Element should not be visible') {
    logger.info(`Assert: ${message}`);
    await expect(locator, message).toBeHidden();
  },

  /** Assert element text equals expected */
  async textEquals(locator, expectedText, message) {
    const desc = message || `Text should equal "${expectedText}"`;
    logger.info(`Assert: ${desc}`);
    await expect(locator, desc).toHaveText(expectedText);
  },

  /** Assert element text contains expected */
  async textContains(locator, expectedText, message) {
    const desc = message || `Text should contain "${expectedText}"`;
    logger.info(`Assert: ${desc}`);
    await expect(locator, desc).toContainText(expectedText);
  },

  /** Assert element is enabled */
  async enabled(locator, message = 'Element should be enabled') {
    logger.info(`Assert: ${message}`);
    await expect(locator, message).toBeEnabled();
  },

  /** Assert element is disabled */
  async disabled(locator, message = 'Element should be disabled') {
    logger.info(`Assert: ${message}`);
    await expect(locator, message).toBeDisabled();
  },

  /** Assert element count */
  async hasCount(locator, expected, message) {
    const desc = message || `Element count should be ${expected}`;
    logger.info(`Assert: ${desc}`);
    await expect(locator, desc).toHaveCount(expected);
  },

  /** Assert page URL */
  async url(page, expectedUrl, message) {
    const desc = message || `URL should match "${expectedUrl}"`;
    logger.info(`Assert: ${desc}`);
    await expect(page, desc).toHaveURL(expectedUrl);
  },

  /** Assert input value */
  async hasValue(locator, expectedValue, message) {
    const desc = message || `Value should be "${expectedValue}"`;
    logger.info(`Assert: ${desc}`);
    await expect(locator, desc).toHaveValue(expectedValue);
  },

  /** Assert two plain values are strictly equal (synchronous) */
  equals(actual, expected, message) {
    const desc = message || `Expected "${expected}" but got "${actual}"`;
    logger.info(`Assert: ${desc}`);
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${desc}`);
    }
  },

  /** Assert two arrays/objects are deeply equal (synchronous) */
  deepEquals(actual, expected, message) {
    const desc = message || 'Values should be deeply equal';
    logger.info(`Assert: ${desc}`);
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(
        `Assertion failed: ${desc} — Expected: ${expectedStr}, Got: ${actualStr}`
      );
    }
  },
};

module.exports = Assert;
