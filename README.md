# PickleJS
"Cucumber with Brine"

PickleJS is an addon for the Cucumber plugin for Cypress allowing automatic story writing.

## Installation
### Add The Dependency
```
yarn add --dev https://github.com/tolicodes/picklejs
```

### Create the Selector JSON Files
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

### I should see "{string}" [on the] <Element/>

Ex:
* I should see "Press Me" on the "Button" inside the "Modal"
Then(
    r(`I should see ${string}${elInEl}`),
    (text, el, parent) => shouldExist(el, { parent, text })
);

// putting after because the one before exclusively works 
// for text and doesn't have a verb before it
// ex: I should see "Press Me Button" on the "Button" inside the "Modal"
Then(
    r(`I should see${elInEl}`),
    (el, parent) => shouldExist(el, { parent })
);

// ex:  I should not see the "Buttons" in the "Modal"
//      I should not see "Buttons" on the "Page"
//      I should not see the "Button"
Then(
    r(`I should not see${elInEl}`),
    (el, parent) => {
        getNormalized([parent, el], { singular: true })
            .should('have.length', 0);
    }
);

// ex: "Username" should be "toli"
Then('{string} should be {string}', shouldExist);

// ex: "Username's" value should be "toli"
Then('{string} value should be {string}', shouldExist);

## Example App
Run
```
yarn cypress:open
```

Website:

Run:
```
yarn start
```