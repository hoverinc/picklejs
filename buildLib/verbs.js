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
        global.verbs = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = ['The', 'A', 'a', 'on', 'on the', 'on a', 'the', 'into', 'into the', 'of', 'of the', 'in', 'in the', 'inside', 'inside a', 'inside of', 'inside of a', 'inside the', 'inside of the'];
});
//# sourceMappingURL=verbs.js.map