export default (routes) => {
    beforeEach(() => {
        cy.server();

        // disable all xhrs
        cy.route('**', {});

        console.log(routes);
    
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
    });
}