export default (routes) => {
    beforeEach(() => {
        cy.server();

        // disable all xhrs
        cy.route('**', {});
    
        // implement our fixtures
        Object.entries(routes).forEach(([path, endpoint]) => {
            //cy.fixture(`${endpoint}.json`).as(`fixture${endpoint}`);
            cy.route(path, `fixture:${endpoint}.json`)
                .as(endpoint);
        });
    });
}

// https://github.com/cypress-io/cypress/issues/76
function loadLargeFixture(url, response, method = 'GET') {
    return cy.route({
        url,
        method,
        onRequest: xhr => {
            const originalOnLoad = xhr.xhr.onload;
            xhr.xhr.onload = function() {
                Object.defineProperty(this, 'response', {
                    writable: true
                });
                this.response = response;
                originalOnLoad.apply(this, xhr);
            };
        }
    });
}