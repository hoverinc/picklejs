---
id: recommended-cypress-setup
title: Recommended Cypress Setup
sidebar_label: Recommended Cypress Setup
---

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