Feature: Home
    Background:
        When I open the "Home Screen"

    # Scenario: I should be able to click "Getting Started" in the Header
    #     When I click "Getting Started" in the "Header"
    #     Then I should be redirected to "Getting Started"

    # Scenario: I should be able to click "Get Started" in the Button Row
    #     When I click "Get Started" in the "Buttons Row"
    #     Then I should be redirected to "Getting Started"

    # # Scenario: I should see a presentation
    # #     Then I wait 2 seconds
    # #     Then I take a snapshot of "Presentation"

    Scenario: I should be able to search for a doc
        When I type "recommended" into the "Search Input" in the "Header"
        Then I should see "Recommended Cypress Setup" in the "Search Result" in the "Header"
        
        When I click the "Search Result" in the "Header" containing "Recommended Cypress Setup"
        Then I should be redirected to "Recommended Cypress Setup"