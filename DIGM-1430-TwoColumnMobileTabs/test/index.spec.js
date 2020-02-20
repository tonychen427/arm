const jsdom = require("jsdom");
const {
  expect
} = require("chai");
const {
  JSDOM
} = jsdom;

const {
  twoColumnMobileTabs
} = require('../static/twoColumnMobileTabs.js');

const id = 'c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8';

const tabContent = '.c-two-column-mobile-tabs__content';
const tabContents = '.c-two-column-mobile-tabs__contents';
const tabNavigationLinks = '.c-two-column-mobile-tabs__link';
const isActive = 'is-active';
const noJS = 'no-js';
let component = null;

const tabContentsSelector = '#' + id + ' ' + tabContents;
const tabContentSelector = '#' + id + ' ' + tabContent;
const tabNavigationLinksSelector = '#' + id + ' ' + tabNavigationLinks;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Two column mobile tabs', function () {
  before(function () {
    return JSDOM.fromFile('./src/index.html')
      .then( async (dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        const resizeEvent = document.createEvent('Event');
        resizeEvent.initEvent('resize', true, true);

        global.window.resizeTo = async (width, height) => {
          global.window.innerWidth = width || global.window.innerWidth;
          global.window.innerHeight = width || global.window.innerHeight;
          global.window.dispatchEvent(resizeEvent);
        };

        window.resizeTo(900, 1000);
        await sleep(500);
      });
  });

  it('should not removed the no-js class from the component, when init is not call', function () {
    component = twoColumnMobileTabs({
      id: id,
      tabContents: '.c-two-column-mobile-tabs__contents',
      tabNavigationLinks: '.c-two-column-mobile-tabs__link',
      tabContentContainers: '.c-two-column-mobile-tabs__content'
    });

    expect(document.querySelectorAll(tabContentsSelector)[0].classList.contains(noJS)).to.be.true;
  });

  it('should initializes the component and render DOM, match with ID and remove no-js', function () {
    component.init();
    expect(component.id).to.equal(id);
    expect(document.querySelectorAll(tabContentsSelector)[0].classList.contains(noJS)).to.be.false;
  });

  it('should show one column, in mobile view', function () {
    expect(document.querySelectorAll(tabContentSelector)[0].classList.contains(isActive)).to.be.true;
    expect(document.querySelectorAll(tabContentSelector)[1].classList.contains(isActive)).to.be.false;
  });

  it('should switch to 2nd tab when user click on 2nd tab', async function () {
    expect(document.querySelectorAll(tabContentSelector)[0].classList.contains(isActive)).to.be.true;
    expect(document.querySelectorAll(tabContentSelector)[1].classList.contains(isActive)).to.be.false;

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, true);
    document.querySelectorAll(tabNavigationLinksSelector)[1].dispatchEvent(evt);

    expect(document.querySelectorAll(tabContentSelector)[0].classList.contains(isActive)).to.be.false;
    expect(document.querySelectorAll(tabContentSelector)[1].classList.contains(isActive)).to.be.true;
  });

  it('should switch to 1st tab when user click on 1st tab', async function () {
    expect(document.querySelectorAll(tabContentSelector)[0].classList.contains(isActive)).to.be.false;
    expect(document.querySelectorAll(tabContentSelector)[1].classList.contains(isActive)).to.be.true;

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, true);
    document.querySelectorAll(tabNavigationLinksSelector)[0].dispatchEvent(evt);

    expect(document.querySelectorAll(tabContentSelector)[0].classList.contains(isActive)).to.be.true;
    expect(document.querySelectorAll(tabContentSelector)[1].classList.contains(isActive)).to.be.false;
  });
});
