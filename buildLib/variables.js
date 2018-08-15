(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.variables = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // will hold element selectors throughout the test
    let ELEMENT_SELECTORS = exports.ELEMENT_SELECTORS = {};

    // will hold screen urls throughout the test
    let SCREENS = exports.SCREENS = {};

    // will hold variables used throughout the test suite 
    let STATE = exports.STATE = {};

    const setElementSelector = exports.setElementSelector = selectors => {
        exports.ELEMENT_SELECTORS = ELEMENT_SELECTORS = selectors;
    };

    const setScreens = exports.setScreens = screens => {
        exports.SCREENS = SCREENS = screens;
    };

    const setState = exports.setState = (variable, value) => {
        STATE[variable] = value;
    };
});
//# sourceMappingURL=variables.js.map