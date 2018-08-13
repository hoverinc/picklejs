(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './variables', 'pluralize'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./variables'), require('pluralize'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.variables, global.pluralize);
        global.functions = mod.exports;
    }
})(this, function (exports, _variables, _pluralize) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.waitForResults = exports.shouldExist = exports.clickElement = exports.itemShouldBeVisible = exports.getSelector = exports.getNormalized = exports.parseNumberEls = exports.selectElement = exports.buildClassSelector = undefined;

    var _pluralize2 = _interopRequireDefault(_pluralize);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Builds class selectors for our react Styled Component classes (ie. accounts for the `-randomString`). You should just be able to type classes as usual
    const buildClassSelector = exports.buildClassSelector = selectors => selectors.replace(/\.([^.[:\s]+)/g, '[class*="$1"]');

    const selectElement = exports.selectElement = (className, text, context) => {
        const selector = buildClassSelector(className);
        const el = context ? context.get(selector) : cy.get(selector);

        if (!text) return el;

        if (el.contains(text)) {
            return el;
        } else {
            throw new Error('Element doesn\'t contain text');
        }
    };

    // ex: Third Button => [ Button, 3 ]
    const parseNumberEls = exports.parseNumberEls = el => {
        const ordinals = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            fifth: 5,
            sixth: 6,
            seventh: 7,
            eighth: 8,
            ninth: 9,
            tenth: 10,
            last: 'last'
        };

        return Object.entries(ordinals).reduce((out, [word, wordValue]) => {
            const { ordinal, el } = out;

            // we already found 
            if (ordinal) return out;

            return el.includes(word) ? {
                ordinal: wordValue,
                el: el.replace(word + ' ', '')
            } : out;
        }, { el });
    };

    // pass a single element or chain (parent => child) as an Array
    // to get the selected Cypress element
    const getNormalized = exports.getNormalized = (elements, { text, singular } = {}) => {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        // in case it comes in from a parent optional environemnt
        elements = elements.filter(el => el);

        // for now we apply it to the first ordinal we get
        // ex: third Button in the second Modal will just get the third Button overall
        let firstOrdinal;
        let lastParentSelectors;

        let className = elements.reduce((out, elementStr, i) => {
            let element;
            // ex: Button's => Button
            element = elementStr.replace('\'s', '');

            if (singular) {
                // Buttons => Button
                element = _pluralize2.default.singular(element);
            }

            const {
                ordinal,
                el
            } = parseNumberEls(element);

            if (!firstOrdinal && ordinal) {
                firstOrdinal = ordinal;
            }

            let selectors = _variables.ELEMENT_SELECTORS;

            // for now just supports 1 level of nest
            if (out[i - 1]) {
                selectors = lastParentSelectors;
            }

            const selector = selectors[el];

            if (!selector) {
                const lastParent = elements[i - 1] ? elements[i - 1] + '>' : '';
                throw new Error(`The className was not defined for ${lastParent}${el}`);
            }

            if (selector.default) {
                lastParentSelectors = selector;
            }

            // if it's a container
            const className = selector.default ? selector.default : selector;

            return [...out, className];
        }, []).join(' ');

        if (text) {
            className += `:contains("${text}")`;
        }

        const el = selectElement(className);

        if (firstOrdinal) {
            if (firstOrdinal === 'last') {
                return el.last();
            } else {
                return el.eq(firstOrdinal - 1);
            }
        }

        return el;
    };

    const getSelector = exports.getSelector = el => {
        const selector = _variables.ELEMENT_SELECTORS[el];

        if (!selector) {
            throw Error(`getSelector cannot find class for ${el}`);
        }

        const className = selector.default ? selector.default : selector;

        return buildClassSelector(className);
    };

    const itemShouldBeVisible = exports.itemShouldBeVisible = el => getNormalized(el).first().should('exist');

    const clickElement = exports.clickElement = (el, parent) => {
        const els = [parent, el].filter(e => e);
        return getNormalized(els).first().click();
    };

    const shouldExist = exports.shouldExist = (element, { parent, text }) => {
        const els = [parent, element].filter(e => e);
        const el = getNormalized(els);

        return text !== undefined ? el.contains(text) : el.should('exist');
    };

    const waitForResults = exports.waitForResults = () => {
        cy.wait(1000);
    };
});
//# sourceMappingURL=functions.js.map