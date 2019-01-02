---
id: router
title: Router
sidebar_label: Router
---

The router provides a very simple abstraction over Cypress's internal `route` function.

You specify routes and the corresponding mocks in the following format

```
import router from 'picklejs/cypress/router'

router({
    'POST /api/route1': 'route1',
    'GET /api/route2': 'route2',
    'PUT /api/route3': 'route3',
    'DELETE /api/route4': 'route4',
    '/api/route5': 'route5',
});
```

What it transforms it to is:

```
cy.route('POST', '/api/route1', 'fixture:route1.json');
cy.route('GET', '/api/route2', 'fixture:route2.json');
cy.route('PUT', '/api/route3', 'fixture:route3.json');
cy.route('DELETE', '/api/route4', 'fixture:route4.json');
cy.route('GET', '/api/route5', 'fixture:route5.json');
```

Essentially, if you don't provide the HTTP Verb, it will use `GET`, and it will transform the value of the hash map by tacking on a `.json` at the end. Super simple

## API Helpers
We also prover a bunch of API helpers for quickly returning results that aren't in fixtures.

All of these helpers use the format

```
function(url, method, body)
```

In each case the 2nd an 3rd parameters are optional (will default to `GET` and `{}` respectively

### apiError
Usage

```
apiError('/home', 'GET', 'This is my error') =>
cy.route({
    'GET',
    '/home',
    status: 401,
    response: { error: 'This is my error' },
})
```

### apiSuccess
Usage

```
apiSuccess('/home', 'GET', { }) =>
cy.route({
    'GET',
    '/home',
    status: 401,
    response: { error: 'This is my error' },
})
```

### apiNotFound
Usage

```
apiNotFound('/home') =>
cy.route({
    'GET',
    '/home',
    status: 404
})
```