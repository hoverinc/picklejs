(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './verbs'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./verbs'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.verbs);
        global.regexBuilder = mod.exports;
    }
})(this, function (exports, _verbs) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.page = exports.elInEl = exports.int = exports.string = exports.or = exports.r = undefined;

    var _verbs2 = _interopRequireDefault(_verbs);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const r = exports.r = str => new RegExp(`^${str}$`, 'i');

    const or = exports.or = (arr, { capture, required } = {}) => `(${capture ? '' : '?:'}${arr.join('|')})${required ? '' : '?'}`;

    const string = exports.string = '"([^"]+)"';
    const int = exports.int = '(\\d+)';

    const elInEl = exports.elInEl = `\\s?${or(_verbs2.default)}\\s?${string}(?:\\s?${or(_verbs2.default)} ${string})?(?: containing ${string})?`;
    const page = exports.page = `(?: the)? ${string}(?:\\s(?:page|screen|Page|Screen))?`;
});
//# sourceMappingURL=regexBuilder.js.map