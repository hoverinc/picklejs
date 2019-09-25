const parseRoute = require('../common/parseRoute');

const processRoutes = (routes) => {
    // implement our fixtures
    Object.entries(routes).forEach(([route, endpoint]) => {
        const {
            method,
            path
        } = parseRoute(route);

        cy.route(method, path, `fixture:${endpoint}`)
            .as(endpoint);
    });
}

module.exports = (routes, { stubAll } = {}) => {
    beforeEach(() => {
        cy.server();
        
        // disable all xhrs
        if(stubAll) cy.route('**', {});

        processRoutes(routes);
    });
}