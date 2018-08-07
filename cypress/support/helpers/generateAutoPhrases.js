import {
    SCREENS
} from './variables';

import {
    clickElement,
    shouldSeeTextIn,
    shouldBe,
    itemShouldBeVisible,
    getNormalized,
} from './functions';

export default () => {
    const mainVerbs = [
        'on',
        'on the',
        'the',  
    ]
    const secondItemVerbs = [
        ...mainVerbs,
        'in',
        'in the',
        'inside',
        'inside the',
    ];

    mainVerbs.forEach(verb => {
        // ex: I click on the "Button"
        When(`I click ${verb} {string}`, clickElement);

        // ex: I should see "Button" inside the "Modal"
        Then(`I should see {string} ${verb} {string}`, shouldSeeTextIn);
        
        // ex: I should see the "Button" in the "Top Nav"
        Then(`I should see the {string} ${verb} {string}`, shouldSeeTextIn);

        secondItemVerbs.forEach(verb2 => {
            // ex: I click on the "Button" inside the "Modal"
            When(`I click ${verb} {string} ${verb2} {string}`, clickElement);

            // ex: on the "Button" inside the "Modal" should be "Press Me"
            Then(`${verb} {string} ${verb2} {string} should be {string}`, shouldBe);
            
            // ex: I should see "Press Me" on the "Button" inside the "Modal"
            Then(`I should see {string} ${verb2} {string} ${verb2} {string}`, shouldSeeTextIn);
        });
    });

    // ex: I open the "Login Screen"
    When('I open the {string}', screen => {
        const url = SCREENS[screen];
        
        if(!url) throw Error(`Screen ${screen} has no specified URL`);
        
        cy.visit(url); 
    });

    // ex: I scroll to the bottom the "Modal"
    When('I scroll to the bottom of the {string}', el => {
        getNormalized(el).scrollTo('bottom');
    });

    // ex: When I type "toli" into the "Username Input"
    When ('I type {string} into the {string}', (text, input) => {
        getNormalized(input).type(text);
    });

    // ex: I should be redirected to the "Login Screen"
    Then('I should be redirected to the {string}', url => {
        cy.url().shouldBe(url);
    });

    // I should see 3 "Buttons"
    Then('I should see {int} {string}', (number, el) => {
        getNormalized(el)
            .should('have.length', number);
    });

    // ex: I should see "Button"
    Then('I should see {string}', itemShouldBeVisible);
    // ex: I should see the "Big Button"
    Then('I should see the {string}', itemShouldBeVisible);

    // ex: "Username" should be "toli"
    Then(`{string} should be {string}`, shouldBe);
    // ex: "Username's" value should be "toli"
    Then(`{string} value should be {string}`, shouldBe);
}
