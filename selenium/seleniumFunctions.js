const { assert } = require('chai');
const {
    SCREENS,
    STATE,
    setState,
} = require('../common/variables');

const { getSelector } = require('../common/functions');

const EXIST_TIMEOUT = 60000;

const getNormalized = (browser, elements, { text, singular } = {}) => {
    const { className: selector, firstOrdinal } = getSelector(elements, { text, singular, showOrdinals: true })
    browser.$(selector).waitForExist(EXIST_TIMEOUT);
    const el = browser.$$(selector);

    if(firstOrdinal) {
        if (firstOrdinal === 'last') {
            return el[el.length - 1];
        } else {
            return el[firstOrdinal - 1];
        }
    }
    
    return el;
}

// MORE SPECIALIZED FUNCTIONs (catching Regex)

const scroll = (browser, direction) => {
    const px = direction === 'top' ? 0 : Infinity;
    browser.scroll(null, 0, px);
}

const scrollTo = (browser, el, parent, text ) => (
    browser.scroll(
        getNormalized(browser, [parent, el], { text })[0]
    )
);

const click = (browser, el, parent, text) => (
    getNormalized(browser, [parent, el], { text })[0].click()
);

const type = (browser, text, input, parent) => {
    const randomVariableRegex = /<rand:(\w+)>/;
    const randomVariable = text.match(randomVariableRegex);
    
    if (randomVariable) {
        const randomNumber = Math.round(Math.random() * 10000).toString();
        text = text.replace(randomVariableRegex, randomNumber);
        setState(randomVariable[1], randomNumber);
    }

    const stateVariableRegex = /<var:(\w+) >/;
    const stateVariable = text.match(stateVariableRegex);

    if (stateVariable) {
        text = text.replace(stateVariableRegex, STATE[stateVariable[1]]);
    }

    getNormalized(browser, [parent, input])[0].addValue(text);
}

const replace = (browser, input, parent, contains, text) => {
    getNormalized(browser, [parent, input], { text: contains })
        .setValue(text);
}

const open = (browser, screen) => {
    const url = SCREENS[screen];
    
    if(!url) throw Error(`Screen ${screen} has no specified URL`);
    return browser.url(url); 
}

// avoid using if possible
const wait = (browser, secs) => {
    browser.pause(secs * 1000);
}

// legacy method...deprecate
const waitForResults = (browser) => {
    browser.pause(1000);
}

// Experimental, not nailed down yet
const dragAbove = (browser, el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
}

const takeSnapshot = (browser) => {
    const [{ isWithinMisMatchTolerance }] = browser.checkViewport();
    assert.isTrue(isWithinMisMatchTolerance);
}

const takeElSnapshot =  (browser, el, parent) => {
    const [{ isWithinMisMatchTolerance }] = browser.checkElement(getNormalized(browser, [parent, el]));
    assert.isTrue(isWithinMisMatchTolerance);
}

const onPage = (browser, screen) => {
    assert.isTrue(browser.getUrl().contains(SCREENS[screen]));
}

const redirectedTo = onPage;

const nElements = (browser, number, el, parent, text) => {
    assert.isEqual(
        getNormalized(browser, [parent, el], { singular: true, text }).length,
        number
    );
};

const elExists = (browser, el, parent, { text } = {}) => {
    const singleEl = getNormalized(browser, [parent, el], { text })[0];
    
    assert.isTrue(!!singleEl);
};

const textOnEl = (browser, text, el, parent) => elExists(browser, el, parent, { text });

const elDoesNotExist =  (browser, el, parent, text) => {
    assert.isEqual(
        getNormalized(browser, [parent, el], { text, singular: true }).length,
        0
    );
}

const elBackground = (browser, background, el, parent, text) => {
    assert.isEqual(
        getNormalized(browser, [parent, el], { text }).getCssProperty('background-color'),
        hex2rgbCSS(background)
    );
};

const elBorder = (browser, background, el, parent, text) => {
    assert.isEqual(
        getNormalized(browser, [parent, el], {text}).getCssProperty('border-color'),
        hex2rgbCSS(background)
    );
}

module.exports = {
    scroll,
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
};