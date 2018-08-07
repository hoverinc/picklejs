import {
    ELEMENT_SELECTORS
} from './variables';

import pluralize from 'pluralize';

// Builds class selectors for our react Styled Component classes (ie. accounts for the `-randomString`). You should just be able to type classes as usual
export const buildClassSelector = selectors => (
    selectors.replace(/\.([^.[:\s]+)/g, '[class*="$1"]')
);

export const selectElement = (className, text, context) => {
    const selector = buildClassSelector(className);
    const el = context
        ? context.get(selector)
        : cy.get(selector);
    
    if (!text) return el;

    if(el.contains(text)) {
        return el;
    } else {
        throw new Error('Element doesn\'t contain text');
    }
}

// ex: Third Button => [ Button, 3 ]
export const parseNumberEls = el => {
    const ordinals = {
        first: 1,
        second: 2,
        third: 3,
        last: 'last',
    };

    return Object.entries(ordinals).reduce((out, [word, wordValue]) => {
        const { ordinal, el } = out;
        
        // we already found 
        if(ordinal) return out;

        return (el.includes(word))
            ? ({
                ordinal: wordValue,
                el: el.replace(word + ' ', '')
            })
            : out
    }, { el });
}

// pass a single element or chain (parent => child) as an Array
// to get the selected Cypress element
export const getNormalized = (elements) => {
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    
    const className = elements.reduce((out, elementStr, i) => {
        // ex: Button's => Button
        const withoutAppostopheS = elementStr.replace('\'s', '');
        // Buttons => Button
        const singular = pluralize.singular(withoutAppostopheS);
        
        const {
            ordinal, 
            el
        } = parseNumberEls(singular);
    
        let selectors = ELEMENT_SELECTORS;

        // for now just supports 1 level of nest
        if (out[i - 1]) {
            const parentSelector = out[i - 1];
            
            selectors = Object.entries(ELEMENT_SELECTORS)
                .find(([, selector]) => {
                    // it's a string
                    if (selector === parentSelector) {
                        throw new Error(`Parent "${parentSelector}" is a string, needs to be an object`)
                    }

                    return selector.default === parentSelector;
                })[1];
        }

        const selector = selectors[el];

        if (!selector) {
            throw new Error(`The className was not defined for ${el}`);
        }

        // if it's a container
        const className = selector.default
            ? selector.default
            : selector;

        
            console.log(className)
    
        return [...out, className];
    }, []).join(' ');

    return selectElement(className);
}

export const itemShouldBeVisible = el => (
    getNormalized(el).first().should('exist')
);

export const clickElement = (el, parent) => {
    const els = [parent, el].filter(e=>e);
    return getNormalized(els).first().click()
};

export const shouldBe = (elName, parentName, value) => {
    if (value === undefined) {
        value = parent;
    }

    const el = getNormalized([parentName, elName]);

    return value !== undefined
        ? el.contains(value)
        : el.should('exist');
}

export const shouldSeeTextIn = (text, el, parent) => shouldBe(el, parent, text)
