const Iframe = require('react-iframe').default;
const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="/docs/getting-started">Get Started</Button>
            <Button href="https://github.com/hoverinc/picklejs">Github</Button>
          </PromoSection>

          <Iframe
            url="//slides.com/anatoliyzaslavskiy/deck/embed"
            height="500px"
            position="relative"
            allowFullScreen
            />
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="left" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="fourColumn">
    {[
      {
        imageAlign: 'top',
        image: imgUrl('no-js.png'),
        content: 'Product Owners or QA can write tests themselves in plain english',
        title: 'No Javascript Knowledge Required',
      },
      {
        imageAlign: 'top',
        image: imgUrl('extend.png'),
        content: 'It\'s all simple regular expressions. Extend it however you want',
        title: 'Easily Extendable',
      },
      {
        imageAlign: 'top',
        image: imgUrl('flexible.png'),
        textAlign: 'left',
        content: `
All of the following are valid:

- When I click on the "Button"
- When I click the "Button"
- When I click the "Button" in the "Header"
- When I click a "Button" inside the "Modal"
        `,
        title: 'Flexible Sentence Structure',
      },
    ]}
  </Block>
);

const LearnHow = () => (
  <Block background="light" textAlign="left">
    {[
      {
        content: `
Here are some examples. All human readable. You just need to define you selectors and you're good to go!

    Scenario: Test a site out
        When I open the "Home Page"
        And I click on the "Get Started Button" inside of the "Header"
        Then I should be redirected to the "Getting Started Page"
    
    Scenario: Sign up for updates
        When I open the "Home Page"
        And I enter "toli@hoverinc.com" into the "Email Input" in the "Newsletter Form"
        And I click "Submit" in the "Newletter Form"
        Then I should see a "Newsletter Signup Confirmation Popup"

    Scenario: I make 2 searches
        When I open the "Home Page"
        And I type "pickle" into the "Search Input" in the "Header"
        Then the "first Result" in "Search Results" should contain "pickle"

        And I replace the contents of "Search Input" in the "Header" with "scroll"
        Then  the "first Result" in "Search Results" should contain "scroll"
    
    Scenario: I scroll to the bottom of the page
        When I scroll to the bottom of the page
        Then the "Who's Using This Section" should be visible
        `,
        title: 'See How Easy It Is...',
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }

  const showcase = siteConfig.users.filter(user => user.pinned).map(user => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Who is Using This?</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <LearnHow />
          <Showcase language={language} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
