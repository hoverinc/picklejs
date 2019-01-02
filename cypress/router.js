const processRoutes = (routes) => {
    // implement our fixtures
    Object.entries(routes).forEach(([path, endpoint]) => {
        let method = 'GET';
        const methods = ['POST', 'GET', 'DELETE', 'PUT'];

        methods.forEach(m => {
            if (path.includes(`${m} `)) {
                path = path.replace(`${m} `, '');
                method = m;
            }
        });

        cy.route(method, path, `fixture:${endpoint}.json`)
            .as(endpoint);
    });
}

module.exports =(routes, { stubAll } = {}) => {
    beforeEach(() => {
        cy.server();
        
        // disable all xhrs
        if(stubAll) cy.route('**', {});

        processRoutes(routes);
    });
}