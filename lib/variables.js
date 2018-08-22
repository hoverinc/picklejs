// will hold element selectors throughout the test
export let ELEMENT_SELECTORS = {};

// will hold screen urls throughout the test
export let SCREENS = {};

// will hold variables used throughout the test suite 
export let STATE = {};

export const setElementSelector = selectors => {
    ELEMENT_SELECTORS = {
        ...ELEMENT_SELECTORS,
        ...selectors
    }
};

export const setScreens = screens => {
    SCREENS = {
        ...SCREENS,
        ...screens
    };
}

export const setState = (variable, value) => {
    STATE[variable] = value;
}