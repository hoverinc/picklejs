import selectors from './selectors.json';
import screens from './screens.json';

import generateAutoPhrases from '@tolicodes/picklejs/buildLib/generateAutoPhrases';

import {
    setScreens,
    setElementSelector,
} from '@tolicodes/picklejs/buildLib/variables';

generateAutoPhrases();

setScreens(screens);
setElementSelector(selectors);
