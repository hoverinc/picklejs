import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
import phrases from './phrases';
addMatchImageSnapshotCommand({
    failureThreshold: 2,
    failureThresholdType: 'percent',
    capture: 'viewport',
});

export default phrases;