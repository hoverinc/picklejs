---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Installing
## Install Cypress
We assume that you are familiar with the Cypress framework. Follow [these instructions](https://docs.cypress.io/guides/getting-started/installing-cypress.html) for setup. 

[Here's our recommended installation](#recommended-cypress-installation)

## Add The Dependency
```
yarn add --dev https://github.com/tolicodes/picklejs
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

/plugins
    - index.js <--change this

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

### /plugins/index.js
Replace the contents with
```
const pickle = require('picklejs/index');

module.exports = pickle; 
```

### /support/step_definitions/your-component/feature.js
Replace the contents with:

```
import generateAutoPhrases from 'picklejs/buildLib/generateAutoPhrases';

import {
    setScreens,
    setElementSelector,
} from 'picklejs/buildLib/variables';

import selectors from './selectors.json';
import screens from '../screens.json';

generateAutoPhrases();
setScreens(screens);
setElementSelector(selectors);
```

### 
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
} from '../../helpers/variables';

setElementSelector(selectors);
```

### Add generateAutoPhrases
Inside your `step_definitions` for each feature, put in the main JS file:

```
import generateAutoPhrases from '../../helpers/generateAutoPhrases';

generateAutoPhrases();
```

### Add Helper Functions
Inside your `step_definitions` for each module, create a 
```
import {
    getNormalized,
    waitForResults,
    clickElement,
    getSelector,
} from '../../helpers/functions';
```

## API

### Scenarios
#### When I click [an] \<Element\>
Clicks on element

Ex:
* I click on the "Button"
* I click "Save"
* I click on "Save" inside the "Modal"


#### When I type "{string}" [into the] \<Element\>
Types string into a text input

Ex:
* I type "toli" into the "Username Input"
* I type "toli" into "Username"
* I type "toli" into the "Username Input" on the "SignIn form"

#### When I replace the contents [of] \<Element\> with "{string}"
Replace the content of text input with string

Ex:
* When I replace the contents of "Username" with "toli"
* When I replace the contents of "Username" inside of the "Login Modal" with "toli"


#### I open [the] \<Screen\>
Navigates to a Screen's URL

Ex:
* I open the "Login Screen"

#### I scroll to the bottom of the \<Element\>
Scrolls to the bottom of an Element (note: currently only scrolls to bottom of the page)

Ex:
* I scroll to the bottom the "Modal"


#### I wait for results to load
Waits for an AJAX request to finish

This is currently not working as it should so I replaced with a `wait(1000)`

#### I should be redirected to the \<Screen\>
Redirects to a the Screen's url

Ex:
* I should be redirected to the "Login Screen"

#### I should see {int} \<Element\> [in] \<Element\> [containing "{string}]
Checks to see if there are specified number of Elements (optionally containing some text) in another Element

Ex:
* I should see 3 "Buttons" in "Modal" containing "Click Me"
* I should 3 "Buttons" in "Modal"

#### I should see "{string}" [on the] \<Element\>

Ex:
* I should see "Press Me" on the "Button" inside the "Modal"

#### I should see \<Element\> [on the] \<Element\>
There is text present inside the element

Ex:
* I should see "Press Me" on the "Button" inside the "Modal"

#### I should not see \<Element\> [on the] \<Element\>
An element should not be present

Ex:
* I should not see the "Buttons" in the "Modal"
* I should not see "Buttons" on the "Page"
* I should not see the "Button"

#### \<Element\> should be "{string}"
There should be text present on the element

Ex:
* "Username" should be "toli"

#### \<Element\> value should be "{string}"
There should be text present on the element

Ex:
* "Username's" value should be "toli"

### Router
Write about it....


### API
Write about it...

### Functions
Wriate about it...

## Example App
WORK IN PROGRESS

Run
```
yarn cypress:open
```

Website:

Run:
```
yarn start
```

## Developing
When making a change just run the following to build.

```
yarn buildLib
```

# Recommended Cypress Installation
1. Install Cypress Dep
    ```
    yarn add cypress --dev
    ```
1. [Setup recording](https://docs.cypress.io/guides/core-concepts/dashboard-service.html#Setup) and get your record key (not required but strongly recommended)
    
1. Add the following to `package.json`'s `scripts` key. Make sure you replace `<YOUR_KEY>` with the key from step2 (or just don't use ` --record --key <YOUR_KEY>`)
    ```
    "scripts": {
        "cypress:open": "cypress open",
        "cypress:run": "yarn run cypress run --record --key <YOUR_KEY>",
        "cypress:ci": "yarn run cypress:run --parallel"
    }
    ```

1. Configure your CircleCI File (if you're using CircleCI)
    ```
    aliases:        
        - &save_cache
            paths:
            # we need both yarn cache and node_modules
            # also make sure that working dir is app
            - ~/.cache/yarn
            - node_modules
            key: yarn-packages-{{ checksum "yarn.lock" }}

        - &restore_cache
            name: Restore Yarn Package Cache
            keys:
                # only restores cache if the yarn file is the same
                - yarn-packages-{{ checksum "yarn.lock" }}
        
        - &install_deps
            name: Install Dev Yarn deps
            command:  yarn install --production=false
        
    jobs:
        cypress_tests:
            parallelism: 4
            steps:
                - checkout
                - restore_cache: *restore_cache
                - run: *install_deps
                - save_cache: *save_cache

                - run: <START YOUR APP HERE>
                - run:
                    name: Install Cypress
                    command: sudo apt-get -y install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 && yarn cypress install
                - run:
                    name: Run tests
                    command: sudo yarn run cypress:ci --ci-build-id ${CIRCLE_BUILD_NUM}
    ```