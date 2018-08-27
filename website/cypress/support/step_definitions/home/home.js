import selectors from './selectors.json';
import screens from './screens.json';

import generateAutoPhrases from 'picklejs/buildLib/generateAutoPhrases';

import {
    setScreens,
    setElementSelector,
} from 'picklejs/buildLib/variables';

generateAutoPhrases();

setScreens(screens);
setElementSelector(selectors);
