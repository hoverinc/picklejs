export default (routes) => {
    beforeEach(() => {
        cy.server();

        // disable all xhrs
        cy.route('**', {});
    
        // implement our fixtures
        Object.entries(routes).forEach(([path, endpoint]) => {
            cy.route(path, `fixture:${endpoint}.json`)
                .as(endpoint);
        });
    });
}