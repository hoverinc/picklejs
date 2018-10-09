import hex2rgb from 'hex-rgb';
import wordsToNumbers from 'words-to-numbers';
import pluralize from 'pluralize';

import {
    SCREENS,
    STATE,
    setState,
    ELEMENT_SELECTORS,
} from './variables';

// COMMON FUNCTIONS

export const hex2rgbCSS = (hex) => {
    const { red, green, blue, alpha } = hex2rgb(hex);

    return `rgb(${red}, ${green}, ${blue}${alpha < 255 ? `, ${parseInt(alpha * 100) / 100}` : ''})`;
}

// Builds class selectors for our react Styled Component classes (ie. accounts for the `-randomString`). You should just be able to type classes as usual
export const buildClassSelector = selectors => (
    selectors.replace(/\.([^.[:\s]+)/g, '[class*="$1"]')
);

// ex: Third Button => [ Button, 3 ]
export const parseNumberEls = el => {
    if(el.includes('last')) {
        return {
            ordinal: 'last',
            el: el.replace('last ', '')
        }
    } else {
        const parsed = wordsToNumbers(el);
        const numbers = parsed.match(/\d+/);
        
        if(numbers) {
            return {
                el: parsed.replace(numbers[0] + ' ', ''),
                ordinal: parseInt(numbers[0]),
            };
        } else {
            return {
                el: parsed,
            };
        }
    }
}

// pass a single element or chain (parent => child) as an Array
// to get the selected Cypress element
export const getSelector = (elements, { text, singular, showOrdinals } = {}) => {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }

    // in case it comes in from a parent optional environemnt
    elements = elements.filter(el=>el);

    // for now we apply it to the first ordinal we get
    // ex: third Button in the second Modal will just get the third Button overall
    let firstOrdinal;
    let lastParentSelectors;
    
    let className = elements.reduce((out, elementStr, i) => {
        let element;
        // ex: Button's => Button
        element = elementStr.replace('\'s', '');
        
        if(singular) {
            // Buttons => Button
            element = pluralize.singular(element);
        }

        const {
            ordinal, 
            el
        } = parseNumberEls(element);

        if (!firstOrdinal && ordinal) {
            firstOrdinal = ordinal;
        }
    
        let selectors = ELEMENT_SELECTORS;

        // for now just supports 1 level of nest
        if (out[i - 1]) {            
            selectors = lastParentSelectors;
        }

        const selector = selectors[el];

        if (!selector) {
            const lastParent = elements[i - 1]
                ? elements[i - 1] + '>'
                : '';
            throw new Error(`The className was not defined for ${lastParent}${el}`);
        }

        if (selector.default) {
            lastParentSelectors = selector;
        }

        // if it's a container
        const className = selector.default
            ? selector.default
            : selector;
    
        return [...out, className];
    }, []).join(' ');

    if (text) {
        className += `:contains("${text}")`;
    }

    className = buildClassSelector(className);

    return showOrdinals ?
     {
         className,
         firstOrdinal
     }
     : className;
}

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

export const takeSnapshot = name => {
    cy.matchImageSnapshot(name);
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