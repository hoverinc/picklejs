const cucumber = require('cypress-cucumber-preprocessor').default;
const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

module.exports = (on) => {
  addMatchImageSnapshotPlugin(on);
  on('file:preprocessor', cucumber());
}