const {
    scroll,
    click,
    type,
    replace,
    open,
    waitForResults,
    dragAbove,
    takeSnapshot,
    takeElSnapshot,
    takeNamedSnapshot,
    onPage,
    redirectedTo,
    nElements,
    textOnEl,
    elExists,
    elHasValue,
    elDoesNotExist,
    elBackground,
    elBorder,
} = require('./cypressFunctions');

const REGEX = require('../common/regex');

module.exports = () => {
    // ex: I scroll to the bottom the "Modal"
    When(REGEX.SCROLL, scroll);

    // ex:  I click on the "Button"
    //      I click "Save"
    //      I click on "Save" inside the "Modal"
    //      I click on "Button" inside the "Modal" containing "Save"
    When(REGEX.CLICK, click);


    // ex:  I type "toli" into the "Username Input"
    //      I type "toli" into "Username"
    //      I type "toli" into the "Username Input" on the "SignIn form"
    When(REGEX.TYPE, type);

    // ex:  When I replace the contents of "Username" with "toli"
    //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
    When(REGEX.REPLACE, replace);

    // ex: I open the "Login Screen"
    When(REGEX.OPEN, open);

    // @TODO: Figure out while default way isn't working
    When(REGEX.WAIT_FOR_RESULTS, waitForResults);

    // use only in cases where Cypress functions can't be used
    When(REGEX.WAIT_SECONDS, (seconds) => {
        cy.wait(seconds * 1000);
    });

    // This is experimental and not part of the official API
    When(REGEX.DRAG_ABOVE, dragAbove);

    When(REGEX.TAKE_SNAPSHOT, takeSnapshot);

    When(REGEX.TAKE_EL_SNAPSHOT, takeElSnapshot);

    When(REGEX.TAKE_SNAPSHOT_NAMED, takeNamedSnapshot)

    // ex: I should be on the "Login Screen"
    Then(REGEX.ON_PAGE, onPage);

    // ex: I should be redirected to the "Login Screen"
    Then(REGEX.REDIRECTED_TO, redirectedTo);

    // I should see 3 "Buttons" in "Modal"
    Then(REGEX.N_ELEMENTS, nElements);

    // ex: I should see "Press Me" on the "Button" inside the "Modal"
    Then(REGEX.TEXT_ON_EL, textOnEl);

    // putting after because the one before exclusively works
    // for text and doesn't have a verb before it
    // ex: I should see "Press Me Button" on the "Button" inside the "Modal"
    Then(REGEX.EL_EXISTS, elExists);

    // ex:  I should not see the "Buttons" in the "Modal"
    //      I should not see "Buttons" on the "Page"
    //      I should not see the "Button"
    Then(REGEX.EL_DOES_NOT_EXIST, elDoesNotExist);

    // ex: "Username" should be "toli"
    Then(REGEX.EL_CONTAINS_TEXT, elHasValue);

    // ex: "Username's" value should be "toli"
    Then(REGEX.EL_VALUE, elHasValue);

    // ex: I should see a "red" background on the "Button"
    Then(REGEX.EL_BACKBGROUND, elBackground)

    // ex: I should see a "red" border on the "Button"
    Then(REGEX.EL_BORDER, elBorder)
}
