Feature: Cart Management

  Background:
    Given I open the SauceDemo website
    When I login with valid credentials
    Then I verify the products page is visible

  @smoke
  Scenario: Add product and verify cart buttons
    When I add a product to the cart
    Then I verify the cart quantity is 1
    When I navigate to the Cart page
    Then I verify buttons Remove, Checkout and Continue are enabled
    When I remove the product
    Then I verify the cart is empty

  @smoke
  Scenario: Add multiple products to cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then I verify the cart quantity is 2

  @smoke
  Scenario: Cart persists after navigating back to products
    When I add a product to the cart
    Then I verify the cart quantity is 1
    When I navigate to the Cart page
    And I click Continue Shopping
    Then I verify the cart quantity is 1

  @smoke
  Scenario: Remove product from cart page leaves cart empty
    When I add a product to the cart
    And I navigate to the Cart page
    When I remove the product
    Then I verify the cart is empty
