import hex2rgb from 'hex-rgb';

import {
    SCREENS
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
    'on the',
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

export const elInEl = `${or(verbs)} ${string}(?:${or(verbs)} ${string})?`;

export default () => {
    // ex:  I click on the "Button"
    //      I click "Save"
    //      I click on "Save" inside the "Modal"
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
            getNormalized([parent, input]).type(text);
        }
    );

    // ex:  When I replace the contents of "Username" with "toli"
    //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
    When(
        r(`I replace the contents${elInEl} with ${string}`),
        (input, parent, text) => {
            // overload
            if (!text) text = parent;

            getNormalized([parent, input])
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
    When('I scroll to the bottom of the {string}', (el) => {
        let windowObj;
        cy.window()
            .then(win => {
                windowObj = win;
                return cy.get('body')
            })
            .then(body => {
                const { scrollHeight} = body[0];
                windowObj.scrollTo(0, scrollHeight + 100);
            });        
    });

    // @TODO: Figure out while default way isn't working
    When('I wait for results to load', waitForResults);

    // ex: I should be redirected to the "Login Screen"
    Then('I should be redirected to the {string}', url => {
        cy.url().shouldBe(url);
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
}
