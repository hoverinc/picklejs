import selectors from './selectors.json';
import screens from './screens.json';

import generateAutoPhrases from 'picklejs/generateAutoPhrases';

import {
    setScreens,
    setElementSelector,
} from '../../helpers/variables';

generateAutoPhrases();

setScreens(screens);
setElementSelector(selectors);
