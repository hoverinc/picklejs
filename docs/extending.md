---
id: extending
title: Extending
sidebar_label: Extending
---
### Custom Phrases
It is possible to create your own phrases which trigger cypress commands. In order to create a custom phrase, add something like the following to your `/support/step_definitions/your-component/feature.js` file:

```
Given(
    'Some phrase with a {string}, another {string}, and an {int}',
    (string1, string2, int1) => {
      // your cypress commands here
    },
);
```