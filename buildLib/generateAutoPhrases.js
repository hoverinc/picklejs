(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'hex-rgb', 'cypress-image-snapshot/command', './variables', './functions'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('hex-rgb'), require('cypress-image-snapshot/command'), require('./variables'), require('./functions'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.hexRgb, global.command, global.variables, global.functions);
        global.generateAutoPhrases = mod.exports;
    }
})(this, function (exports, _hexRgb, _command, _variables, _functions) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.elInEl = exports.int = exports.string = exports.or = exports.r = exports.hex2rgbCSS = exports.verbs = undefined;

    var _hexRgb2 = _interopRequireDefault(_hexRgb);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const verbs = exports.verbs = ['a', 'on', 'on the', 'an a', 'the', 'into', 'into the', 'of', 'of the', 'in', 'in the', 'inside', 'inside of', 'inside the', 'inside of the'];

    const hex2rgbCSS = exports.hex2rgbCSS = hex => {
        const { red, green, blue, alpha } = (0, _hexRgb2.default)(hex);

        return `rgb(${red}, ${green}, ${blue}${alpha < 255 ? ` ${alpha}` : ''})`;
    };

    // regex builder (via string)
    const r = exports.r = str => new RegExp(`^${str}$`, 'i');

    const or = exports.or = (arr, { capture, noLeadingSpace, required } = {}) => `(${capture ? '' : '?:'}${arr.map(word => (noLeadingSpace ? '' : ' ') + word).join('|')})${required ? '' : '?'}`;

    const string = exports.string = '"([^"]+)"';
    const int = exports.int = '(\\d+)';

    const elInEl = exports.elInEl = `${or(verbs)} ${string}(?:${or(verbs)} ${string})?(?: containing ${string})?`;

    (0, _command.addMatchImageSnapshotCommand)();

    exports.default = () => {
        // ex:  I click on the "Button"
        //      I click "Save"
        //      I click on "Save" inside the "Modal"
        //      I click on "Button" inside the "Modal" containing "Save"
        When(r(`I click${elInEl}`), _functions.clickElement);

        // ex:  I type "toli" into the "Username Input"
        //      I type "toli" into "Username"
        //      I type "toli" into the "Username Input" on the "SignIn form"
        When(r(`I type ${string}${elInEl}`), (text, input, parent) => {
            const randomVariableRegex = /<rand:(\w)+>/;
            const randomVariable = text.match(randomVariableRegex);

            if (randomVariable) {
                const randomNumber = Math.round(Math.random() * 10000);
                text = text.replace(randomVariableRegex, randomNumber);
                (0, _variables.setState)(randomVariable[1], randomNumber);
            }

            const stateVariableRegex = /<var:(\w)+>/;
            const stateVariable = text.match(stateVariableRegex);

            if (stateVariable) {
                text = text.replace(stateVariableRegex, _variables.STATE[stateVariable[1]]);
            }

            (0, _functions.getNormalized)([parent, input]).type(text);
        });

        // ex:  When I replace the contents of "Username" with "toli"
        //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
        When(r(`I replace the contents${elInEl} with ${string}`), (input, parent, contains, text) => {
            (0, _functions.getNormalized)([parent, input], { text: contains }).clear().type(text);
        });

        // ex: I open the "Login Screen"
        When(r(`I open${elInEl}`), screen => {
            const url = _variables.SCREENS[screen];

            if (!url) throw Error(`Screen ${screen} has no specified URL`);

            cy.visit(url);
        });

        // ex: I scroll to the bottom the "Modal"
        When(r(`I scroll to the (top|bottom) of the page`), direction => {
            let windowObj;
            cy.window().then(win => {
                windowObj = win;
                return cy.get('body');
            }).then(body => {
                const { scrollHeight } = body[0];
                const px = direction === 'top' ? 0 : scrollHeight + 100;

                windowObj.scrollTo(0, px);
            });
        });

        // @TODO: Figure out while default way isn't working
        When('I wait for results to load', _functions.waitForResults);

        When(r(`I drag${elInEl} above${elInEl}`), (el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
            const $el1 = (0, _functions.getNormalized)([el1Parent, el1], { text: el1Contains });
            $el1.trigger('mousedown', { which: 1, force: true });

            let el2X = 0;
            let el2Y = 0;

            (0, _functions.getNormalized)([el2Parent, el2], { text: el2Contains }).then($el => {
                const { x, y } = $el[0].getBoundingClientRect();
                el2X = x;
                el2Y = y;

                return (0, _functions.getNormalized)('Ranking Form');
            }).then($el => {
                const { x: containerX, y: containerY } = $el[0].getBoundingClientRect();

                const newPosOpts = {
                    x: 400,
                    y: 100,
                    force: true
                };

                $el.trigger('mousemove', newPosOpts).trigger('mouseup', newPosOpts);
            });
        });

        When('I take a snapshot', () => {
            cy.matchImageSnapshot({
                threshold: .05
            });
        });

        // ex: I should be redirected to the "Login Screen"
        Then(r(`I should be redirected to (?:the )*${string}`), screen => {
            cy.url().should('contain', _variables.SCREENS[screen]);
        });

        // I should see 3 "Buttons" in "Modal"
        Then(r(`I should see ${int}${elInEl}(?: containing ${string})?`), (number, el, parent, text) => {
            (0, _functions.getNormalized)([parent, el], { singular: true, text }).should('have.length', number);
        });

        // ex: I should see "Press Me" on the "Button" inside the "Modal"
        Then(r(`I should see ${string}${elInEl}`), (text, el, parent) => (0, _functions.shouldExist)(el, { parent, text }));

        // putting after because the one before exclusively works 
        // for text and doesn't have a verb before it
        // ex: I should see "Press Me Button" on the "Button" inside the "Modal"
        Then(r(`I should see${elInEl}`), (el, parent) => (0, _functions.shouldExist)(el, { parent }));

        // ex:  I should not see the "Buttons" in the "Modal"
        //      I should not see "Buttons" on the "Page"
        //      I should not see the "Button"
        Then(r(`I should not see${elInEl}`), (el, parent) => {
            (0, _functions.getNormalized)([parent, el], { singular: true }).should('have.length', 0);
        });

        // ex: "Username" should be "toli"
        Then('{string} should be {string}', _functions.shouldExist);

        // ex: "Username's" value should be "toli"
        Then('{string} value should be {string}', _functions.shouldExist);

        // ex: I should see a "red" background on the "Button"
        Then(r(`I should see a ${string} background${elInEl}`), (background, el, parent) => {
            (0, _functions.getNormalized)([parent, el]).should('have.css', 'background-color', hex2rgbCSS(background));
        });

        // ex: I should see a "red" border on the "Button"
        Then(r(`I should see a ${string} border${elInEl}`), (background, el, parent) => {
            (0, _functions.getNormalized)([parent, el]).should('have.css', 'border-color', hex2rgbCSS(background));
        });
    };
});
//# sourceMappingURL=generateAutoPhrases.js.map