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
        global.router = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const processRoutes = exports.processRoutes = routes => {
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

            cy.route(method, path, `fixture:${endpoint}.json`).as(endpoint);
        });
    };

    exports.default = routes => {
        beforeEach(() => {
            // disable all xhrs
            cy.route('**', {});

            processRoutes(routes);
        });
    };
});
//# sourceMappingURL=router.js.map