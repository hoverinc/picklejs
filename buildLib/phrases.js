(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './functions', './regexBuilder'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./functions'), require('./regexBuilder'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.functions, global.regexBuilder);
        global.phrases = mod.exports;
    }
})(this, function (exports, _functions, _regexBuilder) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.REGEX = undefined;
    const REGEX = exports.REGEX = {
        SCROLL: (0, _regexBuilder.r)(`I scroll to the (top|bottom) of the page`),
        CLICK: (0, _regexBuilder.r)(`I click${_regexBuilder.elInEl}`),
        TYPE: (0, _regexBuilder.r)(`I type ${_regexBuilder.string}${_regexBuilder.elInEl}`),
        REPLACE: (0, _regexBuilder.r)(`I replace the contents${_regexBuilder.elInEl} with ${_regexBuilder.string}`),
        OPEN: (0, _regexBuilder.r)(`I open${_regexBuilder.page}`),
        WAIT_FOR_RESULTS: (0, _regexBuilder.r)(`I wait for results to load`),
        WAIT_SECONDS: (0, _regexBuilder.r)(`I wait ${_regexBuilder.int} seconds`),
        DRAG_ABOVE: (0, _regexBuilder.r)(`I drag${_regexBuilder.elInEl} above${_regexBuilder.elInEl}`),
        TAKE_SNAPSHOT: (0, _regexBuilder.r)(`I take a snapshot`),
        TAKE_EL_SNAPSHOT: (0, _regexBuilder.r)(`I take a snapshot of${_regexBuilder.elInEl}`),
        ON_PAGE: (0, _regexBuilder.r)(`I should be on${_regexBuilder.page}`),
        REDIRECTED_TO: (0, _regexBuilder.r)(`I should be redirected to${_regexBuilder.page}`),
        N_ELEMENTS: (0, _regexBuilder.r)(`I should see ${_regexBuilder.int}${_regexBuilder.elInEl}`),
        TEXT_ON_EL: (0, _regexBuilder.r)(`I should see ${_regexBuilder.string}${_regexBuilder.elInEl}`),
        EL_EXISTS: (0, _regexBuilder.r)(`I should see${_regexBuilder.elInEl}`),
        EL_DOES_NOT_EXIST: (0, _regexBuilder.r)(`I should not see${_regexBuilder.elInEl}`),
        EL_CONTAINS_TEXT: (0, _regexBuilder.r)(`${_regexBuilder.elInEl} should (?:be|contain) ${_regexBuilder.string}`),
        EL_VALUE: (0, _regexBuilder.r)(`${_regexBuilder.elInEl} value should be ${_regexBuilder.string}`),
        EL_BACKBGROUND: (0, _regexBuilder.r)(`I should see a ${_regexBuilder.string} background${_regexBuilder.elInEl}`),
        EL_BORDER: (0, _regexBuilder.r)(`I should see a ${_regexBuilder.string} border${_regexBuilder.elInEl}`)
    };

    exports.default = () => {
        // ex: I scroll to the bottom the "Modal"
        When(REGEX.SCROLL, _functions.scroll);

        // ex:  I click on the "Button"
        //      I click "Save"
        //      I click on "Save" inside the "Modal"
        //      I click on "Button" inside the "Modal" containing "Save"
        When(REGEX.CLICK, _functions.click);

        // ex:  I type "toli" into the "Username Input"
        //      I type "toli" into "Username"
        //      I type "toli" into the "Username Input" on the "SignIn form"
        When(REGEX.TYPE, _functions.type);

        // ex:  When I replace the contents of "Username" with "toli"
        //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
        When(REGEX.REPLACE, _functions.replace);

        // ex: I open the "Login Screen"
        When(REGEX.OPEN, _functions.open);

        // @TODO: Figure out while default way isn't working
        When(REGEX.WAIT_FOR_RESULTS, _functions.waitForResults);

        // use only in cases where Cypress functions can't be used
        When(REGEX.WAIT_SECONDS, seconds => {
            cy.wait(seconds * 1000);
        });

        // This is experimental and not part of the official API
        When(REGEX.DRAG_ABOVE, _functions.dragAbove);

        When(REGEX.TAKE_SNAPSHOT, _functions.takeSnapshot);

        When(REGEX.TAKE_EL_SNAPSHOT, _functions.takeElSnapshot);

        // ex: I should be on the "Login Screen"
        Then(REGEX.ON_PAGE, _functions.onPage);

        // ex: I should be redirected to the "Login Screen"
        Then(REGEX.REDIRECTED_TO, _functions.redirectedTo);

        // I should see 3 "Buttons" in "Modal"
        Then(REGEX.N_ELEMENTS, _functions.nElements);

        // ex: I should see "Press Me" on the "Button" inside the "Modal"
        Then(REGEX.TEXT_ON_EL, _functions.textOnEl);

        // putting after because the one before exclusively works 
        // for text and doesn't have a verb before it
        // ex: I should see "Press Me Button" on the "Button" inside the "Modal"
        Then(REGEX.EL_EXISTS, _functions.elExists);

        // ex:  I should not see the "Buttons" in the "Modal"
        //      I should not see "Buttons" on the "Page"
        //      I should not see the "Button"
        Then(REGEX.EL_DOES_NOT_EXIST, _functions.elDoesNotExist);

        // ex: "Username" should be "toli"
        Then(REGEX.EL_CONTAINS_TEXT, _functions.elExists);

        // ex: "Username's" value should be "toli"
        Then(REGEX.EL_VALUE, _functions.elExists);

        // ex: I should see a "red" background on the "Button"
        Then(REGEX.EL_BACKBGROUND, _functions.elBackground);

        // ex: I should see a "red" border on the "Button"
        Then(REGEX.EL_BORDER, _functions.elBorder);
    };
});
//# sourceMappingURL=phrases.js.map