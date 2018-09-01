import {
    scroll,
    click,
    replace,
    open,
    waitForResults,
    dragAbove,
    takeSnapshot,
    takeElSnapshot,
    onPage,
    nElements,
    textOnEl,
    elExists,
    elDoesNotExist,
    elBackground,
    elBorder,
} from './functions';

import {
    r,
    string,
    int,
    elInEl,
    page,
} from './regexBuilder';

export const REGEX = {
    SCROLL: r(`I scroll to the (top|bottom) of the page`),
    CLICK: r(`I click${elInEl}`),
    TYPE: r(`I type ${string}${elInEl}`),
    REPLACE: r(`I replace the contents${elInEl} with ${string}`),
    OPEN: r(`I open${page}`),
    WAIT_FOR_RESULTS: r(`I wait for results to load`),
    WAIT_SECONDS: r(`I wait ${int} seconds`),
    DRAG_ABOVE: r(`I drag${elInEl} above${elInEl}`),
    TAKE_SNAPSHOT:  r(`I take a snapshot named ${string}`),
    TAKE_EL_SNAPSHOT: r(`I take a snapshot of${elInEl}`),
    ON_PAGE: r(`I should be on${page}`),
    REDIRECTED_TO: r(`I should be redirected to${page}`),
    N_ELEMENTS: r(`I should see ${int}${elInEl}`),
    TEXT_ON_EL: r(`I should see ${string}${elInEl}`),
    EL_EXISTS: r(`I should see${elInEl}`),
    EL_DOES_NOT_EXIST: r(`I should not see${elInEl}`),
    EL_CONTAINS_TEXT: r(`${elInEl} should (?:be|contain) ${string}`),
    EL_VALUE: r(`${elInEl} value should be ${string}`),
    EL_BACKBGROUND: r(`I should see a ${string} background${elInEl}`),
    EL_BORDER: r(`I should see a ${string} border${elInEl}`),
};

export default () => {
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
    Then(REGEX.EL_CONTAINS_TEXT, shouldExist);

    // ex: "Username's" value should be "toli"
    Then(REGEX.EL_VALUE, shouldExist);

    // ex: I should see a "red" background on the "Button"
    Then(REGEX.EL_BACKBGROUND, elBackground)

    // ex: I should see a "red" border on the "Button"
    Then(REGEX.EL_BORDER, elBorder)
}
