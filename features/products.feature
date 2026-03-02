Feature: Products Page

  Background:
    Given I open the SauceDemo website
    When I login with valid credentials
    Then I verify the products page is visible

  @smoke
  Scenario: Display all products with names and prices
    Then I log all product names and prices

  @smoke
  Scenario Outline: Sort products by <sort_option>
    When I sort products by "<sort_option>"
    Then the products should be sorted by <field> in <order> order

    Examples:
      | sort_option         | field | order      |
      | Name (A to Z)       | name  | ascending  |
      | Name (Z to A)       | name  | descending |
      | Price (low to high) | price | ascending  |
      | Price (high to low) | price | descending |
