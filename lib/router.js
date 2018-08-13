Cypress.Commands.add('setupApiFixtures', routes => {
    beforeEach(() => {
        cy.server();

        // disable all xhrs
        cy.route('**', {})
    
        // implement our fixtures
        Object.entries(routes).forEach(([path, endpoint]) => {
            cy.fixture(`${endpoint}.json`).as(`fixture${endpoint}`);
            cy.route(path, `@fixture${endpoint}`)
                .as(endpoint);
        });
    });
});