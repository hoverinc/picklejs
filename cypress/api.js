// Creates an error response for given URL
const apiError = (url, method='GET', error = 'Error') => (
    cy.route({
        method,
        url,
        status: 401,
        response: { error },
    })
);

// Creates success response for given URL
const apiSuccess = (url, method='GET', body = {}) => (
    cy.route({
        method,
        url,
        status: 200,
        response: body,
    })
);

const apiNotFound = (url, method='GET') => (
    cy.route({
        method,
        url,
        status: 404,
    })
);

module.exports = {
    apiError,
    apiSuccess,
    apiNotFound,
}