// will hold element selectors throughout the test
export let ELEMENT_SELECTORS = {};

// will hold screen urls throughout the test
export let SCREENS = {};

export const setElementSelector = selectors => {
    ELEMENT_SELECTORS = selectors
};

export const setScreens = screens => {
    SCREENS = screens
}