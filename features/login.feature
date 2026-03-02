Feature: Login Functionality

  Background:
    Given I open the SauceDemo website

  @smoke
  Scenario: Successful login with valid credentials
    When I login with valid credentials
    Then I verify the products page is visible

  @negative
  Scenario Outline: Login with invalid credentials - <case>
    When I login with username "<username>" and password "<password>"
    Then I should see the error message "<error>"

    Examples:
      | case              | username        | password       | error                                                                     |
      | locked out user   | locked_out_user | secret_sauce   | Epic sadface: Sorry, this user has been locked out.                       |
      | wrong credentials | invalid_user    | wrong_password | Epic sadface: Username and password do not match any user in this service |
      | empty username    |                 | secret_sauce   | Epic sadface: Username is required                                        |
      | empty password    | standard_user   |                | Epic sadface: Password is required                                        |

  @demo-failure
  Scenario: Intentional failure to verify reporting
    When I login with valid credentials
    Then I should see the error message "This will fail intentionally"
