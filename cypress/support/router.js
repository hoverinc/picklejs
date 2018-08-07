Cypress.Commands.add('setupApiFixtures', () => {
    cy.server();

    // disable all xhrs
    cy.route('**', {})

    const routes = { 
         '/api/test': 'test'
    };

    // implement our fixtures
    Object.entries(routes).forEach(([path, endpoint]) => {
        cy.fixture(`${endpoint}.json`).as(`fixture${endpoint}`);
        cy.route('GET', path, `@fixture${endpoint}`)
            .as('get' + endpoint);
    });
}); 