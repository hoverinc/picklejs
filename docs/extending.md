---
id: extending
title: Extending
sidebar_label: Extending
---
### Custom Phrases
It is possible to create your own phrases which trigger cypress commands. In order to create a custom phrase, add something like the following to your `/support/step_definitions/your-component/feature.js` file:

```
Given(
    'I make a phrase with a {string}, another {string}, and a {int}',
    (string1, string2, int1) => {
      // your cypress commands here
    },
);
```

Now, in your tests, this new phrase can be used just like the built in phrases:

```
When I make a phrase with a "Cool String", another "Nice String", and a 100
Then I should see a "Button"
```