---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Installing
## Install Cypress
We assume that you are familiar with the Cypress framework. Follow [these instructions](https://docs.cypress.io/guides/getting-started/installing-cypress.html) for setup. 

[Here's our recommended installation](recommended-cypress-setup)

## Add The Dependency
```
yarn add --dev https://github.com/hoverinc/picklejs
```

## Create Necessary Files
Your Cypress installation should already scaffold most of this. The files you'll be creating or changing are marked by `<--create this` or `<--change this`


```
/cypress
/fixtures
    - example.json

/integration
    /your-component
        - your-feature.feature <-- create this

/plugins.js <--change this

/support
    step_definitions <-- create this
        your-component <--  create this
            main.js <-- create this
            - selectors.json <-- create this
            ...PUT THE REST OF YOUR CUSTOM FUNCTIONS FOR FEATURES HERE..
        - screens.json <-- create this

    - commands.js
    - index.js
```

### /plugins.js
Replace the contents with:
```
const pickle = require('picklejs/cypress/plugin');

module.exports = pickle; 
```

### /support/step_definitions/screens.json
This goes at the top level of your test files. You will put the URLs of all your screens here. It should look like this:

```
{
    "Home Page": "https://picklejs.com/",
    "Phrases": "https://picklejs.com/phrases",
    "Getting Started": "https://picklejs.com/getting-started"
}
```

### /support/step_definitions/selectors.json
This is included for every feature you write. It will include all of the elements and their parents. 

*Remember to include a key called `default` which is the selector for the parent.*

All selectors are matched using `[class*="your-selector"]`. So if you are using Styled Components, your selectors might look like `.styled__Header-sdj94s9d` but you only need to write `.styled__Header` or even `.Header`. 

You can use any selector supported by Cypress, which supports most CSS3 selectors including my favorite, `:contains()`.

```
{
    "Header": {
        "default": ".Header",
        "Search Input": ".SearchInput"
        "Getting Started Link": "a[href="getting-started"]"
    },

    "Sidebar": {
        "default": ".Sidebar",
        "Phrases Link": "a:contains('Phrases')"
    }
}
```

### /support/step_definitions/your-component/feature.js
Replace the contents with:

```
import generateAutoPhrases from 'picklejs/cypress';

import {
    setScreens,
    setElementSelector,
} from 'picklejs/common/variables';

import selectors from './selectors.json';
import screens from './screens.json';

generateAutoPhrases();
setScreens(screens);
setElementSelector(selectors);
```

### Add selectors
Inside your `step_definitions` for each feature, create a

selectors.json
```
{
    "Plain English Name": ".Selector",
    "Some Container": {
        "default": ".Container-Class",
        "Some Subcomponent": ".Subcomponent Class"
    },
}
```

In your JS file for the feature add

```
import selectors from './selectors.json';
import {
    setElementSelector,
} from 'picklejs/common/variables';

setElementSelector(selectors);
```

### Cypress
Inside your `step_definitions` in your main JS file put:

```
import init from 'picklejs/cypress';

init();
```

### Selenium
Inside your `step_definitions` in your main JS file put:

```
import init from 'picklejs/selenium';

init();
```