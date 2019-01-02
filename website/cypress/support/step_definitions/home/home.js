import selectors from './selectors.json';
import screens from './screens.json';

import init from 'picklejs/cypress';

import {
    setScreens,
    setElementSelector,
} from 'picklejs/common/variables';

init();

setScreens(screens);
setElementSelector(selectors);