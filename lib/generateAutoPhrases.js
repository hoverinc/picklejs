import hex2rgb from 'hex-rgb';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

import {
    SCREENS,
    STATE,
    setState,
} from './variables';

import {
    clickElement,
    shouldExist,
    getNormalized,
    waitForResults,
} from './functions';

export const verbs = [
    'a',
    'on',
    'on the',
    'an a',
    'the',
    'into',
    'into the',
    'of',
    'of the',
    'in',
    'in the',
    'inside',
    'inside of',
    'inside the',
    'inside of the',
];

export const hex2rgbCSS = (hex) => {
    const { red, green, blue, alpha } = hex2rgb(hex);

    return `rgb(${red}, ${green}, ${blue}${alpha < 255 ? ` ${alpha}` : ''})`;
}

// regex builder (via string)
export const r = str => new RegExp(`^${str}$`, 'i');

export const or = (arr, { capture, noLeadingSpace, required } = {}) =>`(${
    capture ? '' : '?:'}${
    arr.map(
        word => (
            noLeadingSpace
                ? ''
                : ' '
            ) + word
    ).join('|')})${
    required ? '' : '?'}`;

export const string = '"([^"]+)"';
export const int = '(\\d+)';

export const elInEl = `${or(verbs)} ${string}(?:${or(verbs)} ${string})?(?: containing ${string})?`;

addMatchImageSnapshotCommand();

export default () => {
    // ex:  I click on the "Button"
    //      I click "Save"
    //      I click on "Save" inside the "Modal"
    //      I click on "Button" inside the "Modal" containing "Save"
    When(
        r(`I click${elInEl}`),
        clickElement
    );


    // ex:  I type "toli" into the "Username Input"
    //      I type "toli" into "Username"
    //      I type "toli" into the "Username Input" on the "SignIn form"
    When(
        r(`I type ${string}${elInEl}`),
        (text, input, parent) => {
            const randomVariableRegex = /<rand:(\w)+>/;
            const randomVariable = text.match(randomVariableRegex);
            
            if (randomVariable) {
                const randomNumber = Math.round(Math.random() * 10000);
                text = text.replace(randomVariableRegex, randomNumber);
                setState(randomVariable[1], randomNumber);
            }

            const stateVariableRegex = /<var:(\w)+>/;
            const stateVariable = text.match(stateVariableRegex);

            if (stateVariable) {
                text = text.replace(stateVariableRegex, STATE[stateVariable[1]]);
            }

            getNormalized([parent, input]).type(text);
        }
    );

    // ex:  When I replace the contents of "Username" with "toli"
    //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
    When(
        r(`I replace the contents${elInEl} with ${string}`),
        (input, parent, contains, text) => {
            getNormalized([parent, input], { text: contains })
                .clear()  
                .type(text);
        }
    );

    // ex: I open the "Login Screen"
    When(
        r(`I open${elInEl}`),
            screen => {
            const url = SCREENS[screen];
            
            if(!url) throw Error(`Screen ${screen} has no specified URL`);
            
            cy.visit(url); 
        }
    );

    // ex: I scroll to the bottom the "Modal"
    When(
        r(`I scroll to the (top|bottom) of the page`),
        (direction) => {
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
    );

    // @TODO: Figure out while default way isn't working
    When('I wait for results to load', waitForResults);

    When(
        r(`I drag${elInEl} above${elInEl}`),
        (el1, el1Parent, el1Contains, el2, el2Parent, el2Contains) => {
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
    );

    When('I take a snapshot', () => {
        cy.matchImageSnapshot(null, {
            threshold: .5,
            thesholdType: percent,
        });
    });

    // ex: I should be redirected to the "Login Screen"
    Then(
        r(`I should be redirected to (?:the )*${string}`),
        screen => {
        cy.url().should('contain', SCREENS[screen]);
    });

    // I should see 3 "Buttons" in "Modal"
    Then(
        r(`I should see ${int}${elInEl}(?: containing ${string})?`),
        (number, el, parent, text) => {
            getNormalized([parent, el], { singular: true, text })
                .should('have.length', number);
        }
    );

    // ex: I should see "Press Me" on the "Button" inside the "Modal"
    Then(
        r(`I should see ${string}${elInEl}`),
        (text, el, parent) => shouldExist(el, { parent, text })
    );
 
    // putting after because the one before exclusively works 
    // for text and doesn't have a verb before it
    // ex: I should see "Press Me Button" on the "Button" inside the "Modal"
    Then(
        r(`I should see${elInEl}`),
        (el, parent) => shouldExist(el, { parent })
    );

    // ex:  I should not see the "Buttons" in the "Modal"
    //      I should not see "Buttons" on the "Page"
    //      I should not see the "Button"
    Then(
        r(`I should not see${elInEl}`),
        (el, parent) => {
            getNormalized([parent, el], { singular: true })
                .should('have.length', 0);
        }
    );

    // ex: "Username" should be "toli"
    Then('{string} should be {string}', shouldExist);

    // ex: "Username's" value should be "toli"
    Then('{string} value should be {string}', shouldExist);

    // ex: I should see a "red" background on the "Button"
    Then(
        r(`I should see a ${string} background${elInEl}`),
        (background, el, parent) => {
            getNormalized([parent, el]).should('have.css', 'background-color', hex2rgbCSS(background))
        }
    )

     // ex: I should see a "red" border on the "Button"
     Then(
        r(`I should see a ${string} border${elInEl}`),
        (background, el, parent) => {
            getNormalized([parent, el]).should('have.css', 'border-color', hex2rgbCSS(background))
        }
    )
}
