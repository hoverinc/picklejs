const fs = require('fs');
const glob = require('glob');
const {
    loadFeature
} = require('jest-cucumber');

const {
    setScreens,
    setElementSelector
} = require('../common/variables');
const phrases = require('./seleniumPhrases');

function runStep(step, browser) {
    return phrases.find(({
        regex,
        func
    }) => {
        const matches = step.match(regex);

        if (!matches) return false;

        return func(browser, ...matches.splice(1));
    })
}

module.exports = function runTests({
    selectorsFile,
    screensFile,
    featuresPath
}) {
    const featureFiles = glob.sync(featuresPath);

    const features = featureFiles.map(loadFeature);

    const screens = JSON.parse(fs.readFileSync(screensFile, 'utf8'));
    const selectors = JSON.parse(fs.readFileSync(selectorsFile, 'utf8'));
    
    setScreens(screens);
    setElementSelector(selectors);
    features.forEach(feature => {
        describe(feature.title, () => {
            feature.scenarios.forEach(({
                title,
                steps
            }) => {
                it(title, function () {
                    steps.forEach(({
                        stepText
                    }) => {
                        runStep(stepText, browser);
                    });
                });
            });
        });
    });
}