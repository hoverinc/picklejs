import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
import 'cypress-testing-library/add-commands';

beforeEach(() => {
    cy.setupApiFixtures();
});

addMatchImageSnapshotCommand();