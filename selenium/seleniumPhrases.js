const {
    scroll,
    scrollTo,
    click,
    type,
    replace,
    open,
    wait,
    waitForResults,
    dragAbove,
    takeSnapshot,
    takeElSnapshot,
    onPage,
    redirectedTo,
    nElements,
    textOnEl,
    elExists,
    elDoesNotExist,
    elBackground,
    elBorder,
} = require('./seleniumFunctions');

const REGEX = require('../common/regex');

const phrases = [];

const addPhrase = (regex, func) => {
    phrases.push({
        regex,
        func,
    })
}

// ex: I scroll to the bottom
addPhrase(REGEX.SCROLL, scroll);

// ex: I scroll to the "Modal"
addPhrase(REGEX.SCROLL_TO, scrollTo);

// ex:  I click on the "Button"
//      I click "Save"
//      I click on "Save" inside the "Modal"
//      I click on "Button" inside the "Modal" containing "Save"
addPhrase(REGEX.CLICK, click);


// ex:  I type "toli" into the "Username Input"
//      I type "toli" into "Username"
//      I type "toli" into the "Username Input" on the "SignIn form"
addPhrase(REGEX.TYPE, type);

// ex:  addPhrase I replace the contents of "Username" with "toli"
//      addPhrase I replace the contents of "Username" inside of the "Login Modal" with "toli"
addPhrase(REGEX.REPLACE, replace);

// ex: I open the "Login Screen"
addPhrase(REGEX.OPEN, open);

// @TODO: Figure out while default way isn't working
addPhrase(REGEX.WAIT_FOR_RESULTS, waitForResults);

// use only in cases where Cypress functions can't be used
addPhrase(REGEX.WAIT_SECONDS, (seconds) => {
    cy.wait(seconds * 1000);
});

// This is experimental and not part of the official API
addPhrase(REGEX.DRAG_ABOVE, dragAbove);

addPhrase(REGEX.TAKE_SNAPSHOT, takeSnapshot);

addPhrase(REGEX.TAKE_EL_SNAPSHOT, takeElSnapshot);

// ex: I should be on the "Login Screen"
addPhrase(REGEX.ON_PAGE, onPage);

// ex: I should be redirected to the "Login Screen"
addPhrase(REGEX.REDIRECTED_TO, redirectedTo);

// I should see 3 "Buttons" in "Modal"
addPhrase(REGEX.N_ELEMENTS, nElements);

// ex: I should see "Press Me" on the "Button" inside the "Modal"
addPhrase(REGEX.TEXT_ON_EL, textOnEl);

// putting after because the one before exclusively works 
// for text and doesn't have a verb before it
// ex: I should see "Press Me Button" on the "Button" inside the "Modal"
addPhrase(REGEX.EL_EXISTS, elExists);

// ex:  I should not see the "Buttons" in the "Modal"
//      I should not see "Buttons" on the "Page"
//      I should not see the "Button"
addPhrase(REGEX.EL_DOES_NOT_EXIST, elDoesNotExist);

// ex: "Username" should be "toli"
addPhrase(REGEX.EL_CONTAINS_TEXT, elExists);

// ex: "Username's" value should be "toli"
addPhrase(REGEX.EL_VALUE, elExists);

// ex: I should see a "red" background on the "Button"
addPhrase(REGEX.EL_BACKBGROUND, elBackground)

// ex: I should see a "red" border on the "Button"
addPhrase(REGEX.EL_BORDER, elBorder)

module.exports = phrases;