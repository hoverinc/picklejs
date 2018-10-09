(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'hex-rgb', 'words-to-numbers', 'pluralize', './variables'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('hex-rgb'), require('words-to-numbers'), require('pluralize'), require('./variables'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.hexRgb, global.wordsToNumbers, global.pluralize, global.variables);
        global.functions = mod.exports;
    }
})(this, function (exports, _hexRgb, _wordsToNumbers, _pluralize, _variables) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.elBorder = exports.elBackground = exports.elDoesNotExist = exports.textOnEl = exports.elExists = exports.nElements = exports.redirectedTo = exports.onPage = exports.takeElSnapshot = exports.takeSnapshot = exports.dragAbove = exports.waitForResults = exports.wait = exports.open = exports.replace = exports.type = exports.click = exports.scroll = exports.getNormalized = exports.getSelector = exports.parseNumberEls = exports.buildClassSelector = exports.hex2rgbCSS = undefined;

    var _hexRgb2 = _interopRequireDefault(_hexRgb);

    var _wordsToNumbers2 = _interopRequireDefault(_wordsToNumbers);

    var _pluralize2 = _interopRequireDefault(_pluralize);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // COMMON FUNCTIONS

    const hex2rgbCSS = exports.hex2rgbCSS = hex => {
        const { red, green, blue, alpha } = (0, _hexRgb2.default)(hex);

        return `rgb(${red}, ${green}, ${blue}${alpha < 255 ? `, ${parseInt(alpha * 100) / 100}` : ''})`;
    };

    // Builds class selectors for our react Styled Component classes (ie. accounts for the `-randomString`). You should just be able to type classes as usual
    const buildClassSelector = exports.buildClassSelector = selectors => selectors.replace(/\.([^.[:\s]+)/g, '[class*="$1"]');

    // ex: Third Button => [ Button, 3 ]
    const parseNumberEls = exports.parseNumberEls = el => {
        if (el.includes('last')) {
            return {
                ordinal: 'last',
                el: el.replace('last ', '')
            };
        } else {
            const parsed = (0, _wordsToNumbers2.default)(el);
            const numbers = parsed.match(/\d+/);

            if (numbers) {
                return {
                    el: parsed.replace(numbers[0] + ' ', ''),
                    ordinal: parseInt(numbers[0])
                };
            } else {
                return {
                    el: parsed
                };
            }
        }
    };

    // pass a single element or chain (parent => child) as an Array
    // to get the selected Cypress element
    const getSelector = exports.getSelector = (elements, { text, singular, showOrdinals } = {}) => {
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

        className = buildClassSelector(className);

        return showOrdinals ? {
            className,
            firstOrdinal
        } : className;
    };

    const getNormalized = exports.getNormalized = (elements, { text, singular } = {}) => {
        const { className, firstOrdinal } = getSelector(elements, { text, singular, showOrdinals: true });
        const el = cy.get(className);

        if (firstOrdinal) {
            if (firstOrdinal === 'last') {
                return el.last();
            } else {
                return el.eq(firstOrdinal - 1);
            }
        }

        return el;
    };

    // MORE SPECIALIZED FUNCTIONs (catching Regex)

    const scroll = exports.scroll = direction => {
        let windowObj;
        cy.window().then(win => {
            windowObj = win;
            return cy.get('body');
        }).then(body => {
            const { scrollHeight } = body[0];
            const px = direction === 'top' ? 0 : scrollHeight + 100;

            windowObj.scrollTo(0, px);
        });
    };

    const click = exports.click = (el, parent, text) => getNormalized([parent, el], { text }).first().click();

    const type = exports.type = (text, input, parent) => {
        const randomVariableRegex = /<rand:(\w+)>/;
        const randomVariable = text.match(randomVariableRegex);

        if (randomVariable) {
            const randomNumber = Math.round(Math.random() * 10000).toString();
            text = text.replace(randomVariableRegex, randomNumber);
            (0, _variables.setState)(randomVariable[1], randomNumber);
        }

        const stateVariableRegex = /<var:(\w+) >/;
        const stateVariable = text.match(stateVariableRegex);

        if (stateVariable) {
            text = text.replace(stateVariableRegex, _variables.STATE[stateVariable[1]]);
        }

        getNormalized([parent, input]).type(text);
    };

    const replace = exports.replace = (input, parent, contains, text) => {
        getNormalized([parent, input], { text: contains }).clear().type(text);
    };

    const open = exports.open = screen => {
        const url = _variables.SCREENS[screen];

        if (!url) throw Error(`Screen ${screen} has no specified URL`);

        cy.visit(url);
    };

    const wait = exports.wait = secs => {
        cy.wait(secs * 1000);
    };

    const waitForResults = exports.waitForResults = () => {
        cy.wait(1000);
    };

    // Experimental, not nailed down yet
    const dragAbove = exports.dragAbove = (el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
        const $el1 = getNormalized([el1Parent, el1], { text: el1Contains });
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

            $el.trigger('mousemove', newPosOpts).trigger('mouseup', newPosOpts);
        });
    };

    const takeSnapshot = exports.takeSnapshot = name => {
        cy.matchImageSnapshot(name);
    };

    const takeElSnapshot = exports.takeElSnapshot = (el, parent) => {
        getNormalized([parent, el]).matchImageSnapshot(el, {
            threshold: 1000,
            thresholdType: 'pixel'
        });
    };

    const onPage = exports.onPage = screen => {
        cy.url().should('contain', _variables.SCREENS[screen]);
    };

    const redirectedTo = exports.redirectedTo = onPage;

    const nElements = exports.nElements = (number, el, parent, text) => {
        getNormalized([parent, el], { singular: true, text }).should('have.length', number);
    };

    const elExists = exports.elExists = (el, parent, { text } = {}) => getNormalized([parent, el], { text }).first().should('exist');

    const textOnEl = exports.textOnEl = (text, el, parent) => elExists(el, parent, { text });

    const elDoesNotExist = exports.elDoesNotExist = (el, parent, text) => {
        getNormalized([parent, el], { text, singular: true }).should('have.length', 0);
    };

    const elBackground = exports.elBackground = (background, el, parent) => {
        getNormalized([parent, el]).should('have.css', 'background-color', hex2rgbCSS(background));
    };

    const elBorder = exports.elBorder = (background, el, parent) => {
        getNormalized([parent, el]).should('have.css', 'border-color', hex2rgbCSS(background));
    };
});
//# sourceMappingURL=functions.js.map