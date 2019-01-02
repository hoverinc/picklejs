const addMatchImageSnapshotCommand = require('cypress-image-snapshot/command').addMatchImageSnapshotCommand;
const phrases = require('./cypressPhrases');

addMatchImageSnapshotCommand({
    failureThreshold: '0.05',
    failureThresholdType: 'percent',
    capture: 'viewport',
});

module.exports = phrases;