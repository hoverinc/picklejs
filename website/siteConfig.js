// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Hover Inc',
    image: 'https://www.alsop-louie.com/wp-content/uploads/2017/03/hover-logo-crop.png',
    infoLink: 'https://www.hover.to',
    pinned: true,
  },
];

const siteConfig = {
  title: 'PickleJS', // Title for your website.
  tagline: 'Cucumber with Brine',
  url: 'https://picklejs.com', // Your website URL
  baseUrl: '/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'picklejs',
  organizationName: 'hover',

  algolia: {
    apiKey: '7e3ddac9ad950ce5cf277ee4f282d812',
    indexName: 'picklejs-website',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
 
  headerLinks: [
    {doc: 'getting-started', label: 'Getting Started'},
    {doc: 'api', label: 'API'},
    {blog: true, label: 'Blog'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/pickle.png',
  footerIcon: 'img/pickle.png',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/pickle.png',
  twitterImage: 'img/pickle.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
