Feature: Home
    Background:
        When I open the "Home Screen"
       
    Scenario: I should be able to add an idea
        When I type "something" into the "New Idea Input"
        Then I should see 4 "Ideas"

        And I should see "something" in the "first Idea" in the "Ideas List"
    