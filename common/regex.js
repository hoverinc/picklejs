const regexBuilder = require('./regexBuilder');
const {
    r,
    string,
    int,
    elInEl,
    page,
} = regexBuilder;

module.exports = {
    SCROLL: r(`I scroll to the (top|bottom) of the page`),
    SCROLL_TO: r(`I scroll to${elInEl}`),
    CLICK: r(`I click${elInEl}`),
    TYPE: r(`I type ${string}${elInEl}`),
    REPLACE: r(`I replace the contents${elInEl} with ${string}`),
    OPEN: r(`I open${page}`),
    WAIT_FOR_RESULTS: r(`I wait for results to load`),
    WAIT_SECONDS: r(`I wait ${int} seconds`),
    DRAG_ABOVE: r(`I drag${elInEl} above${elInEl}`),
    COMPARE_SNAPSHOT:  r(`I compare a snapshot`),
    COMPARE_EL_SNAPSHOT: r(`I compare a snapshot of${elInEl}`),
    COMPARE_SNAPSHOT_NAMED: r(`I compare a snapshot named ${string}`),
    ON_PAGE: r(`I should be on${page}`),
    REDIRECTED_TO: r(`I should be redirected to${page}`),
    N_ELEMENTS: r(`I should see ${int}${elInEl}`),
    TEXT_ON_EL: r(`I should see ${string}${elInEl}`),
    EL_EXISTS: r(`I should see${elInEl}`),
    EL_DOES_NOT_EXIST: r(`I should not see${elInEl}`),
    EL_CONTAINS_TEXT: r(`${elInEl} should (?:be|contain) ${string}`),
    EL_VALUE: r(`${elInEl} value should be ${string}`),
    EL_BACKBGROUND: r(`I should see a ${string} background${elInEl}`),
    EL_BORDER: r(`I should see a ${string} border${elInEl}`),
};