// will hold element selectors throughout the test
let ELEMENT_SELECTORS = {};

// will hold screen urls throughout the test
let SCREENS = {};

// will hold variables used throughout the test suite 
let STATE = {};

const setElementSelector = selectors => {
    Object.assign(ELEMENT_SELECTORS, selectors);
};

const setScreens = screens => {
    Object.assign(SCREENS, screens);
}

const setState = (variable, value) => {
    STATE[variable] = value;
}

module.exports = {
    ELEMENT_SELECTORS,
    SCREENS,
    STATE,
    setElementSelector,
    setScreens,
    setState,
};