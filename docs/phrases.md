---
id: phrases
title: Phrases
sidebar_label: Phrases
---

## Key Concepts
### Grammar
Pickle has a flexible grammar engine that allows for some variations in phrasing. That way you don't have to awkwardly phrase things that don't make sense:

For example:
* I click the "Button" - GOOD
* I click on the "Submit" - WAT?

PickleJS support a range of variations in grammar across most of its functions (where the documentation refers to `<Element>`)

The following prefixes are supported:
* `a`: `I click a "Button"`
* `on`: `I click on "Yellow"`
* `on the`: `I click on the "Next Button"`
* `the`: `I click the "Button"`
* `into`: `I click into "Header"`
*  `into the`: `I click into the "Modal"`

The second half of the list, while technically can be used in front of any Element name, but generally are used in the second part of the sentence, describing where the element is:

* `of`: `I click the "first Button" of "Button List"`
* `of the`: `I click the "last Button" of the :Modal"`
* `in`: `I click on the "Button" in "Button List"`
* `in the`: `I click on the "Button" in the "Modal"`
* `inside`: `I click inside "Main Heading" in the "Header"`
* `inside of`: `I click inside of "Main Heading" on the "Modal"`
* `inside the`: `I click inside the "Image" inside the "Modal"`
* `inside of the`: `I click inside of the "Image" in the "Modal"`

### Element In Element Containing Text
As the number of tests grows, you may want to start grouping your elements into their containers. All functions in Pickle support either referring to an element directly or referring to an element within an element.

In addition you can refer to the text the Main Element contains by adding `containing "Text"`

For example:
* `I click on the "Button"`
* `I click on the "Button" in the "Modal"`
* `I click on the "Button" in the "Modal" containing "Press Me"`
* `I should see a "Button"`
* `I should see 3 "Buttons"`
* `I should see 4 "Buttons" inside the "Modal"`
* `I should see 4 "Buttons" inside the "Modal" containing "Press Me"`

## Whens
### Navigating/Opening a Page
`I open [the] <Screen>`

Navigates to a Screen's URL

Ex:
* `I open the "Login Screen"`

### Clicking
`When I click [an] <Element>`

Clicks on element

Ex:
* `I click on the "Button"`
* `I click "Save"`
* `I click on "Save" inside the "Modal"`


### Typing Into an Input
`When I type "{string}" [into the] <Element>`

Types string into a text input

Ex:
* `I type "toli" into the "Username Input"`
* `I type "toli" into "Username"`
* `I type "toli" into the "Username Input" on the "SignIn form"`

#### Generating Random Data
This is very useful when you need to create a new User during every run.

In the following example, a user with the username with a random digit (ex: "user92372") will be created. The ID 932372 will be saved to the test's internal state as `userId`. And then in any test it can be retrieved.

```
When I type "user<rand:userId>" in the "Username Field" in the "Register Form"
And I click "Submit" in the "Register Form"
And I type "user<var:userId>" in the "Username Field" in the "Login Form"
And I click "Submit" in the "Login Form"
Then I should be redirected to the "Home Page"
```

### Replacing Input Contents
`When I replace the contents [of] <Element> with "{string}"`

Replace the content of text input with string

Ex:
* `When I replace the contents of "Username" with "toli"`
* `When I replace the contents of "Username" inside of the "Login Modal" with "toli"`

### Scrolling
`I scroll to the (bottom|top) of the page`

Scrolls to the bottom of the page

Ex:
* `I scroll to the bottom the page`
* `I scroll to the top of the page`


### Waiting For AJAX to Finish
`I wait for results to load`

Waits for an AJAX request to finish.

This is currently not working as it should so I replaced with a `wait(1000)`. Feel free to submit PRs to fix

### Taking a Snapshot
`I take a snapshot"`

Takes a snapshot of the current screen and compares to a previous snapshot. I guess this is a `Then` as well as `When` functionality wise.

### Taking a Named Snapshot
`I take a snapshot named "{string}"`

Takes a snapshot of the current screen and names it the string you give, then compares to a previous snapshot. I guess this is a `Then` as well as `When` functionality wise.

### Taking an Element Snapshot
`I take a snapshot of the "Header"`
Takes a snapshot of just the element, saves it with the Element's name, and compares to a previous snapshot.

## Thens
### Redirect
`I should be redirected to the <Screen>`

Checks if I am on the Screen's url

Ex:
* `I should be redirected to the "Login Screen"`

### On Page
This is an alias of `Redirect`
`I should be on the <Screen>`

Checks if I am on the Screen's url

### Element Existance
#### Element Exists
`I should see <Element>`

One element is present inside of another

Ex:
* `I should see a "Button"`
* `I should see a "Button" inside the "Modal"`

#### Specified Number of Elements Exist
`I should see {int} <Element> [in] <Element> [containing "{string}]`

Checks to see if there are specified number of Elements (optionally containing some text) in another Element

Ex:
* `I should see 3 "Buttons" in "Modal" containing "Click Me"`
* `I should see 3 "Buttons" in "Modal"`
* `I should see 3 "Buttons"`

#### Element Does not Exist
`I should not see <Element> [on the] <Element>`

An element should not be present

Ex:
* `I should not see the "Buttons" in the "Modal"`
* `I should not see "Buttons" on the "Page"`
* `I should not see the "Button"`

### Element Containing Text
#### Contains Text
`I should see "{string}" [on the] <Element>`

There is text present inside the element

Ex:
* `I should see "Press Me" on the "Button" inside the "Modal"`

#### Input Has Value
`<Input> should be "{string}"`
`<Element> value should be "{string}"`

There should be text present on the element

Ex:
* `"Username" should be "toli"`

## Other Concepts
### Colors
Any function referring to a color should be in RGB format (`#ffffff`). If the orginal color is in RGB format it will be converted.

In the future we will support multiple color formats and even "fuzzy color matching"
