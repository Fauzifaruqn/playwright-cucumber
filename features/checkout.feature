Feature: Checkout Flow

  Background:
    Given I open the SauceDemo website
    When I login with valid credentials
    Then I verify the products page is visible
    And I add a product to the cart
    And I navigate to the Cart page

  @smoke
  Scenario: Complete checkout successfully
    When I click Checkout
    And I fill checkout information with first name "John" last name "Doe" and zip "12345"
    And I click Continue
    Then I verify the checkout overview is displayed
    When I click Finish
    Then I verify the order confirmation is displayed

  @negative
  Scenario Outline: Checkout with missing field - <case>
    When I click Checkout
    And I fill checkout information with first name "<firstName>" last name "<lastName>" and zip "<zip>"
    And I click Continue
    Then I should see the checkout error "<error>"

    Examples:
      | case          | firstName | lastName | zip   | error                          |
      | missing first |           | Doe      | 12345 | Error: First Name is required  |
      | missing last  | John      |          | 12345 | Error: Last Name is required   |
      | missing zip   | John      | Doe      |       | Error: Postal Code is required |
