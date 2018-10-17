import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
import phrases from './phrases';
addMatchImageSnapshotCommand({
    failureThreshold: '0.05',
    failureThresholdType: 'percent',
    capture: 'viewport',
});

export default phrases;