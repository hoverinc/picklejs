// // List of projects/orgs using your project for the users page.
// const users = [
//   {
//     caption: 'Hover Inc',
//     image: 'https://www.alsop-louie.com/wp-content/uploads/2017/03/hover-logo-crop.png',
//     infoLink: 'https://www.hover.to',
//     pinned: true,
//   },
// ];

const siteConfig = {
  title: 'PickleJS', // Title for your website.
  tagline: 'Cucumber with Brine',
  url: 'https://picklejs.com', // Your website URL
  baseUrl: '/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'picklejs',
  organizationName: 'hover',

  algolia: {
    apiKey: 'c8f7088de4cd4b2d23d4ca39ad88fb6e',
    indexName: 'picklejs',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
 
  headerLinks: [
    {doc: 'getting-started', label: 'Getting Started'},
    {doc: 'phrases', label: 'Phrases'},
    {blog: true, label: 'Blog'},
  ],

  /* path to images for header/footer */
  headerIcon: 'img/pickle.png',
  footerIcon: 'img/pickle.png',
  favicon: 'img/pickle.png',

  /* Colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },

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

  repoUrl: 'https://github.com/hoverinc/picklejs',
};

module.exports = siteConfig;
