(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.api = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // Creates an error response for given URL
    const apiError = exports.apiError = (url, method = 'GET', error = 'Error') => cy.route({
        method,
        url,
        status: 401,
        response: { error }
    });

    // Creates success response for given URL
    const apiSuccess = exports.apiSuccess = (url, method = 'GET', body = {}) => cy.route({
        method,
        url,
        status: 200,
        response: body
    });

    const apiNotFound = exports.apiNotFound = (url, method = 'GET') => cy.route({
        method,
        url,
        status: 404
    });
});
//# sourceMappingURL=api.js.map