const {
    SCREENS,
    STATE,
    setState,
} = require('../common/variables');

const { getSelector, hex2rgbCSS } = require('../common/functions');

const getNormalized = (elements, { text, singular } = {}) => {
    const { className, firstOrdinal } = getSelector(elements, { text, singular, showOrdinals: true })
    const el = cy.get(className);

    if(firstOrdinal) {
        if (firstOrdinal === 'last') {
            return el.last();
        } else {
            return el.eq(firstOrdinal - 1);
        }
    }

    return el;
}

// MORE SPECIALIZED FUNCTIONs (catching Regex)

const scroll = (direction) => {
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

const click = (el, parent, text) => (
    getNormalized([parent, el], { text })
        .first()
        .click()
);

const type = (text, input, parent) => {
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

    getNormalized([parent, input]).type(text);
}

const replace = (input, parent, contains, text) => {
    getNormalized([parent, input], { text: contains })
        .clear()
        .type(text);
}

const open = screen => {
    const url = SCREENS[screen];

    if(!url) throw Error(`Screen ${screen} has no specified URL`);

    cy.visit(url);
}

const wait = (secs) => {
    cy.wait(secs * 1000);
}

const waitForResults = () => {
    cy.wait(1000);
}

// Experimental, not nailed down yet
const dragAbove = (el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
    const $el1 =  getNormalized([el1Parent, el1], { text: el1Contains });
    $el1.trigger('mousedown', { which: 1, force: true });

    let el2X = 0;
    let el2Y = 0;

    getNormalized([el2Parent, el2], { text: el2Contains }).then($el => {
      const { x, y } = $el[0].getBoundingClientRect();
      el2X = x;
      el2Y = y;

      return getNormalized('Ranking Form');
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

// threshold for entire image
const snapshotOptions = {
    failureThreshold: 0.10,
    failureThresholdType: 'percent',
}

const takeSnapshot = () => {
    cy.matchImageSnapshot(null, snapshotOptions);

}

const takeNamedSnapshot = (name) => {
    cy.matchImageSnapshot(name, snapshotOptions);
}

const takeElSnapshot =  (el, parent) => {
    getNormalized([parent, el]).matchImageSnapshot(el, snapshotOptions);
}

const onPage = screen => {
    cy.url().should('contain', SCREENS[screen]);
}

const redirectedTo = onPage;

const nElements = (number, el, parent, text) => {
    getNormalized([parent, el], { singular: true, text })
        .should('have.length', number);
};

const elExists = (el, parent, { text } = {}) => (
    getNormalized([parent, el], { text }).first().should('exist')
);

const elHasValue = (el, parent, contains, text) => (
    getNormalized([parent, el]).should('have.value', text)
);

const textOnEl = (text, el, parent) => elExists(el, parent, { text });

const elDoesNotExist =  (el, parent, text) => {
    getNormalized([parent, el], { text, singular: true })
        .should('have.length', 0);
}

const elBackground = (background, el, parent) => {
    getNormalized([parent, el]).should('have.css', 'background-color', hex2rgbCSS(background))
};

const elBorder = (background, el, parent) => {
    getNormalized([parent, el]).should('have.css', 'border-color', hex2rgbCSS(background))
}

module.exports = {
    getNormalized,
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
    elHasValue,
    elDoesNotExist,
    elBackground,
    elBorder,
};