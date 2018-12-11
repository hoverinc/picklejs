const { assert } = require('chai');
const {
    SCREENS,
    STATE,
    setState,
} = require('./variables');

const { getSelector } = require('./functions');

const getNormalized = (browser, elements, { text, singular } = {}) => {
    const { className: selector, firstOrdinal } = getSelector(elements, { text, singular, showOrdinals: true })
    browser.$(selector).waitForExist(60000);
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
    let windowObj;
    cy.window()
        .then(win => {
            windowObj = win;
            return cy.get('body');
        })
        .then(body => {
            const { scrollHeight } = body[0];
            const px = direction === 'top'
                ? 0
                : scrollHeight + 100;

            windowObj.scrollTo(0, px);
        });
}

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

    getNormalized(browser, [parent, input])[0].setValue(text);
}

const replace = (browser, input, parent, contains, text) => {
    getNormalized(browser, [parent, input], { text: contains })
        .clear()  
        .type(text);
}

const open = (browser, screen) => {
    const url = SCREENS[screen];
    
    if(!url) throw Error(`Screen ${screen} has no specified URL`);
    return browser.url(url); 
}

const wait = (browser, secs) => {
    cy.wait(secs * 1000);
}

const waitForResults = (browser) => {
    cy.wait(1000);
}

// Experimental, not nailed down yet
const dragAbove = (browser, el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
    const $el1 =  getNormalized([el1Parent, el1], { text: el1Contains });
    $el1.trigger('mousedown', { which: 1, force: true });

    let el2X = 0;
    let el2Y = 0;
    
    getNormalized(browser, [el2Parent, el2], { text: el2Contains }).then($el => {
      const { x, y } = $el[0].getBoundingClientRect();
      el2X = x;
      el2Y = y;

      return getNormalized(browser, 'Ranking Form');
    }).then($el => {
        const { x: containerX, y: containerY } = $el[0].getBoundingClientRect();

        const newPosOpts = {
            x: 400,
            y: 100,
            force: true
        };

        $el 
            .trigger('mousemove', newPosOpts)
            .trigger('mouseup', newPosOpts);
    });
}

const takeSnapshot = (browser) => {
    cy.matchImageSnapshot();
}

const takeElSnapshot =  (browser, el, parent) => {
    getNormalized(browser, [parent, el]).matchImageSnapshot(el, {
        threshold: 1000,
        thresholdType: 'pixel'
    });
}

const onPage = (browser, screen) => {
    cy.url().should('contain', SCREENS[screen]);
}

const redirectedTo = onPage;

const nElements = (browser, number, el, parent, text) => {
    getNormalized(browser, [parent, el], { singular: true, text })
        .should('have.length', number);
};

const elExists = async (browser, el, parent, { text } = {}) => {
    const singleEl = (await getNormalized(browser, [parent, el], { text }))[0];
    
    assert.isTrue(!!singleEl);
};

const textOnEl = (browser, text, el, parent) => elExists(el, parent, { text });

const elDoesNotExist =  (browser, el, parent, text) => {
    getNormalized(browser, [parent, el], { text, singular: true })
        .should('have.length', 0);
}

const elBackground = (browser, background, el, parent) => {
    getNormalized(browser, [parent, el]).should('have.css', 'background-color', hex2rgbCSS(background))
};

const elBorder = (browser, background, el, parent) => {
    getNormalized(browser, [parent, el]).should('have.css', 'border-color', hex2rgbCSS(background))
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