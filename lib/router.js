export const processRoutes = (routes) => {
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

export default (routes) => {
    beforeEach(() => {
        // disable all xhrs
        cy.route('**', {});
    
        processRoutes(routes);
    });
}