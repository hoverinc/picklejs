import {
    SCREENS,
    STATE,
    setState,
} from './variables';

import { getSelector } from './functions';

export const getNormalized = (elements, { text, singular } = {}) => {
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

export const scroll = (direction) => {
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

export const click = (el, parent, text) => (
    getNormalized([parent, el], { text })
        .first()
        .click()
);

export const type = (text, input, parent) => {
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

export const replace = (input, parent, contains, text) => {
    getNormalized([parent, input], { text: contains })
        .clear()  
        .type(text);
}

export const open = screen => {
    const url = SCREENS[screen];
    
    if(!url) throw Error(`Screen ${screen} has no specified URL`);
    
    cy.visit(url); 
}

export const wait = (secs) => {
    cy.wait(secs * 1000);
}

export const waitForResults = () => {
    cy.wait(1000);
}

// Experimental, not nailed down yet
export const dragAbove = (el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
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

export const takeSnapshot = () => {
    cy.matchImageSnapshot();
}

export const takeElSnapshot =  (el, parent) => {
    getNormalized([parent, el]).matchImageSnapshot(el, {
        threshold: 1000,
        thresholdType: 'pixel'
    });
}

export const onPage = screen => {
    cy.url().should('contain', SCREENS[screen]);
}

export const redirectedTo = onPage;

export const nElements = (number, el, parent, text) => {
    getNormalized([parent, el], { singular: true, text })
        .should('have.length', number);
};

export const elExists = (el, parent, { text } = {}) => (
    getNormalized([parent, el], { text }).first().should('exist')
);

export const textOnEl = (text, el, parent) => elExists(el, parent, { text });

export const elDoesNotExist =  (el, parent, text) => {
    getNormalized([parent, el], { text, singular: true })
        .should('have.length', 0);
}

export const elBackground = (background, el, parent) => {
    getNormalized([parent, el]).should('have.css', 'background-color', hex2rgbCSS(background))
};

export const elBorder = (background, el, parent) => {
    getNormalized([parent, el]).should('have.css', 'border-color', hex2rgbCSS(background))
}