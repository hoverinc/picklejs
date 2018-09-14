---
sidebar_label: Functions
title: Functions
---

Functions can be used individually in your tests programatically. The functions from all our Phrases are available, along with all the helper functions we use

## Helpers
### hex2rbgCSS
```
// converts a color with no alpha
hex2rgbCSS('F2F2F2') => rgb(242, 242, 242)

// converts a color with an alpha
hex2rgbCSS('F2F2F280') => rgb(242, 242, 242, 0.5)
```

### buildClassSelector
```
// Converts a class to an attribute
buildClassSelector('.test-class') => 
[class*="test-class"]

// Attaches :modifiers to the end
buildClassSelector('.test-class:hover') => 
[class*="test-class"]:hover

// Handles child classes
buildClassSelector('.test-class .class-2')) => 
[class*="test-class"] [class*="class-2"]')

// Handles  multiple classes
buildClassSelector('.test-class.class-2') => 
[class*="test-class"][class*="class-2"]

// Handles :contains
buildClassSelector('.test-class:contains("Good Stuff")') => 
[class*="test-class"]:contains("Good Stuff")

// Handle Wierd Combos of Classes
buildClassSelector('.test-class.class-2:active .class3:hover > .class4') =>
[class*="test-class"][class*="class-2"]:active [class*="class3"]:hover > [class*="class4"]
```

### parseNumberEls
Parses out named numbers from a string


```
//handles numbered elements
parseNumberEls('third Button') =>
{
    ordinal: 3,
    el: 'Button'
}

parseNumberEls('fifty-sixth Button') =>
{
    ordinal: 56,
    el: 'Button'
}

// handles last element
parseNumberEls('last Button') => 
{
    ordinal: 'last',
    el: 'Button'
}

// handles elements without a number
parseNumberEls('Button') =>
{
    el: 'Button'
}
```

### getNormalized
Looks up the name of an element in selectors.json and gets its class name. Also works with Parent and Child class.

```
// accepts just the element
getNormalized('Button') =>
cy.get('[class*="button"]')

// accepts an element and its parent
getNormalized(['Modal', 'Button']) =>
cy.get('[class*="modal"] [class*="modal-button"]')

// filters out undefined elements
getNormalized([null,'Button']);
cy.get('[class*="button"]')

// Gets rid of 's
getNormalized(['Button\'s']) =>
cy.get('[class*="button"]');
        
// Makes an element sigular if the singular option is passed in'
getNormalized(['Buttons'], { singular: true } ) => 
cy.get('[class*="button"]')

// parses out ordinals'

getNormalized(['third Button']) => 
cy.get('[class*="button"]').eq(2)

getNormalized(['last Button']) =>
cy.get('[class*="button"]').last();

// selects the correct element if text is passed'
getNormalized('Button', { text: 'Hi There' }) =>
cy.get('[class*="button"]:contains("Hi There")')
```

#### Throws  
```
// throws an error if the selector is not defined'

getNormalized(['Link']) =>
THROWS 'The className was not defined for Link'

getNormalized(['Modal', 'Link']) =>
THROWS 'The className was not defined for Modal>Link'

getNormalized(['Header', 'Link']) => 
THROWS 'The className was not defined for Header
```

### getSelector
Exactly the same as `getNormalized` but just returns the selector as a string without `cy.get`ing it

### elExists 
Checks that the element exists

```
elExists('Button') =>
cy.get('[class*="button"]').first().should('exist')
```

## Phrase Functions
### scroll
```
// Scroll to Top of page
scroll('top');

// Scroll to Bottom of page
scroll('bottom');
```

### click
Clicks on an element
```
// Click on Button
click('Button');

// Click on Button inside the Modal
click('Button', 'Modal')

// Clicks on Button with the text "Hello" inside a Modal
click('Button', 'Modal', { text: 'Hello' })
```

### type
Types into an input

```
// Type hello into Input
type('hello', 'Input');

// Type hello into Input inside of a Modal
type('hello', 'Input', 'Modal')

// Types "user" and a randomly generated ID (5 digits).
// In this case would be something like user12943
// It then saves that random number to the 
// variable name after the `:` (in this case `userId`)
type('user<rand:userId>', 'Input')

// Retrieves a variable stored (in this case what was stored in `userId`). 
// This can be used to generate a random user
// and then log in in a later test
type('user<var:userId>', 'Input');
```

### replace
Replace the contents of an input

```
replace('Input', '', '', 'hello');

replace('Input', 'Modal', '', 'hello');

replace('Input', 'Modal', { text: 'old text' }, 'hello' )
```

### open
Opens a Screen (defined in `screens.json`)

```
open('Home') =>
cy.open('http://mysite.com/')
```

### waitForResults
Waits a second. This is to account for times when the automatic waiting malfunctions.

```
waitForResults() =>
cy.timeout(1000)
```

### takeSnapshot
Takes s a snapshot of the entire page and matches it against al old snapshot taken. Save is under the name specified

```
takeSnapshot('Test Page')
```

### takeElSnapshot
Takes a snapshot of an element

```
takeElSnapshot('Input');
```

### onPage
Expects to be on selected screen

```
onPage('Home') =>
cy.url().should('contain', '/home');
```

### redirectedTo
Alias of `onPage`

### nElements
Expects n Elements on the page

```
nElements(3, 'Input') =>
cy.get('[class*="input"]).should('have.length', 3);

nElements(3, 'Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]).should('have.length', 3);
```

### elExists
Expects element to exist

```
elExists('Input') =>
cy.get('[class*="input"]).should('exist');

elExists('Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]).should('exist');
```

### textOnEl
Expect element to contain text
```
elExists('Text', 'Input') =>
cy.get('[class*="input"]:contains("Text")).should('exist');

elExists('Text', 'Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]:contains("Text)).should('exist');
```

### elDoesNotExist
Expects element to not exist

```
elExists('Input') =>
cy.get('[class*="input"]).should('have.length', 0);

elExists('Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]).should('have.length', 0);
```

### elBackground
Expects element to have a background

```
elExists('#ffffff', 'Input') =>
cy.get('[class*="input"]).should(
    'have.css',
    'background-color'
    'rgb(255, 255, 255)'
);

elExists('Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]).should(
    'have.css',
    'background-color'
    'rgb(255, 255, 255)'
);
```

### elBorder
Expects element to have a border

```
elExists('#ffffff', 'Input') =>
cy.get('[class*="input"]).should(
    'have.css',
    'border-color'
    'rgb(255, 255, 255)'
);

elExists('Input', 'Modal') =>
cy.get('[class*="modal"] [class*="input"]).should(
    'have.css',
    'border-color'
    'rgb(255, 255, 255)'
);
```