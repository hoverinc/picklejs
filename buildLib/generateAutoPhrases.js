(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'cypress-image-snapshot/command', './phrases'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('cypress-image-snapshot/command'), require('./phrases'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.command, global.phrases);
        global.generateAutoPhrases = mod.exports;
    }
})(this, function (exports, _command, _phrases) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _phrases2 = _interopRequireDefault(_phrases);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    (0, _command.addMatchImageSnapshotCommand)({
        failureThreshold: '0.02',
        failureThresholdType: 'percent',
        capture: 'viewport'
    });

    exports.default = _phrases2.default;
});
//# sourceMappingURL=generateAutoPhrases.js.map