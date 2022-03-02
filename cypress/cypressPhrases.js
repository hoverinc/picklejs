const {
    scroll,
    click,
    type,
    fake,
    replace,
    open,
    waitForResults,
    dragAbove,
    compareSnapshot,
    compareElSnapshot,
    compareNamedSnapshot,
    onPage,
    redirectedTo,
    nElements,
    textOnEl,
    elExists,
    elHasValue,
    elDoesNotExist,
    elBackground,
    elBorder,
} = require('./cypressFunctions');

const faker = require('faker');
const changeCase = require('change-case');

const REGEX = require('../common/regex');
const regexBuilder = require('../common/regexBuilder');
const {
    r,
    string,
    int,
    elInEl,
    page,
} = regexBuilder;

module.exports = () => {
    // ex: I scroll to the bottom the "Modal"
    When(REGEX.SCROLL, scroll);

    // ex:  I click on the "Button"
    //      I click "Save"
    //      I click on "Save" inside the "Modal"
    //      I click on "Button" inside the "Modal" containing "Save"
    When(REGEX.CLICK, click);


    // ex:  I type "toli" into the "Username Input"
    //      I type "toli" into "Username"
    //      I type "toli" into the "Username Input" on the "SignIn form"
    When(REGEX.TYPE, type);


    // When I type a fake internet email as "email" in the "Username Field" in the "Register Form"
    // And I click "Submit" in the "Register Form"
    // And I re-type the "email" in the "Username Field" in the "Login Form"
    // And I click "Submit" in the "Login Form"
    // Then I should be redirected to the "Home Page"
    // And I should see "someelement" containing "email"
    // ex:  I type a fake internet username as "userName" into the "Username Input"
    //      I re-type "userName" into "Username"
    // When(REGEX.FAKE, fake);

    // most faker methods
    let fakerCategories = {
      "address": [
        "cardinalDirection",
        "city",
        "cityPrefix",
        "citySuffix",
        "country",
        "countryCode",
        "county",
        "direction",
        "latitude",
        "longitude",
        // "nearbyGPSCoordinate", requires comparsion cords
        "ordinalDirection",
        "secondaryAddress",
        "state",
        "stateAbbr",
        "streetAddress",
        "streetName",
        "streetPrefix",
        "streetSuffix",
        "zipCode",
        "zipCodeByState"
      ],
      "commerce": [
        "department",
        "price",
        "product",
        "productAdjective",
        "productMaterial",
        "productName"
      ],
      "company": [
        "bs",
        "bsAdjective",
        "bsBuzz",
        "bsNoun",
        "catchPhrase",
        "catchPhraseAdjective",
        "catchPhraseDescriptor",
        "catchPhraseNoun",
        "companyName",
        "companySuffix",
        "suffixes"
      ],
      "database": [
        "collation",
        "column",
        "engine",
        "type"
      ],
      "date": [
        // "between", ƒ (from, to), needs params
        "future",
        "month",
        "past",
        "recent",
        "soon",
        "weekday"
      ],
      "finance": [
        "account",
        "accountName",
        "amount",
        "bic",
        "bitcoinAddress",
        "creditCardCVV",
        "creditCardNumber",
        "currencyCode",
        "currencyName",
        "currencySymbol",
        "ethereumAddress",
        "iban",
        "mask",
        "routingNumber",
        "transactionType"
      ],
      "git": [
        "branch",
        "commitEntry",
        "commitMessage",
        "commitSha",
        "shortSha"
      ],
      "hacker": [
        "abbreviation",
        "adjective",
        "ingverb",
        "noun",
        "phrase",
        "verb"
      ],
      // "helpers", these aren't usable
      // "A fake image"
      // "A fake image of <keyword> [with a size of <width> by <height>]"
      // "A fake data uri" // [[height, width], color]
      // // "A fake data uri of <green> with a size of <width> by <height>"
      // "A fake image url"
      // "image": [
      // ]
      "internet": [
        "domainName",
        "domainSuffix",
        "domainWord",
        "email",
        "exampleEmail",
        "ip",
        "ipv6",
        "mac",
        "password",
        "protocol",
        "url",
        "userAgent",
        "userName"
      ],
      "lorem": [
        "lines",
        "paragraph",
        "paragraphs",
        "sentence",
        "sentences",
        "slug",
        "text",
        "word",
        "words"
      ],
      "name": [
        // "findName",
        "firstName",
        "gender",
        "jobArea",
        "jobDescriptor",
        "jobTitle",
        "jobType",
        "lastName",
        "prefix",
        "suffix",
        "title"
      ],
      "phone": [
        "phoneFormats",
        "phoneNumber"
      ],
      "random": [
        "alpha",
        "alphaNumeric",
        "arrayElement",
        "arrayElements",
        "boolean",
        "float",
        "hexaDecimal",
        // "image", same as image
        "locale",
        "number",
        // "objectElement", selects property from object
        "uuid",
        "word",
        "words"
      ],
      "system": [
        "commonFileExt",
        "commonFileName",
        "commonFileType",
        "directoryPath",
        "fileExt",
        "fileName",
        "filePath",
        "fileType",
        "mimeType",
        "semver"
      ],
      "vehicle": [
        "fuel",
        "manufacturer",
        "model",
        "type",
        "vehicle",
        "vin"
      ]
    };

    Object.keys(fakerCategories).forEach(function(category){

      fakerCategories[category].forEach(function(categoryKey){
        let categoryKeyName = changeCase.capitalCase(categoryKey);

        When(r(`I type a fake ${categoryKeyName} as ${string}${elInEl}`), function(asName, input, parent){
          let value = undefined;
          if(categoryKey == "password") {
            value = faker[category][categoryKey](15, true, null, "qQ1!");
          } else {
            value = faker[category][categoryKey]();
          }
          fake(asName, value, input, parent)
        });
      });
    });

    // ex:  When I replace the contents of "Username" with "toli"
    //      When I replace the contents of "Username" inside of the "Login Modal" with "toli"
    When(REGEX.REPLACE, replace);

    // ex: I open the "Login Screen"
    When(REGEX.OPEN, open);

    // @TODO: Figure out while default way isn't working
    When(REGEX.WAIT_FOR_RESULTS, waitForResults);

    // use only in cases where Cypress functions can't be used
    When(REGEX.WAIT_SECONDS, (seconds) => {
        cy.wait(seconds * 1000);
    });

    // This is experimental and not part of the official API
    When(REGEX.DRAG_ABOVE, dragAbove);

    

    Then(REGEX.COMPARE_SNAPSHOT, compareSnapshot);
    Then(REGEX.COMPARE_EL_SNAPSHOT, compareElSnapshot);
    Then(REGEX.COMPARE_SNAPSHOT_NAMED, compareNamedSnapshot)

    // ex: I should be on the "Login Screen"
    Then(REGEX.ON_PAGE, onPage);

    // ex: I should be redirected to the "Login Screen"
    Then(REGEX.REDIRECTED_TO, redirectedTo);

    // I should see 3 "Buttons" in "Modal"
    Then(REGEX.N_ELEMENTS, nElements);

    // ex: I should see "Press Me" on the "Button" inside the "Modal"
    Then(REGEX.TEXT_ON_EL, textOnEl);

    // putting after because the one before exclusively works
    // for text and doesn't have a verb before it
    // ex: I should see "Press Me Button" on the "Button" inside the "Modal"
    Then(REGEX.EL_EXISTS, elExists);

    // ex:  I should not see the "Buttons" in the "Modal"
    //      I should not see "Buttons" on the "Page"
    //      I should not see the "Button"
    Then(REGEX.EL_DOES_NOT_EXIST, elDoesNotExist);

    // ex: "Username" should be "toli"
    Then(REGEX.EL_CONTAINS_TEXT, elHasValue);

    // ex: "Username's" value should be "toli"
    Then(REGEX.EL_VALUE, elHasValue);

    // ex: I should see a "red" background on the "Button"
    Then(REGEX.EL_BACKBGROUND, elBackground)

    // ex: I should see a "red" border on the "Button"
    Then(REGEX.EL_BORDER, elBorder)
}
