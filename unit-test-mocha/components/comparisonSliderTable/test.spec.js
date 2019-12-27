const jsdom = require("jsdom");
const { expect } = require("chai");
const { JSDOM } = jsdom;

const { comparisonSliderTable } = require('./module.js');

const responsive = [
    {
        breakpoint: 1230, // screens greater than >= 1024px
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 1024,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 888,
        settings: {
            slidesToShow: 2,
        }
    },
    {
        breakpoint: 650,
        settings: {
            slidesToShow: 1,
        }
    },
    {
        breakpoint: 370,
        settings: {
            slidesToShow: 1,
        }
    }
];

const id = '#c-67c252d1-ef55-4d96-921b-c56da13ff170';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

describe('Comparison slider table', function () {
  before(function() {
    return JSDOM.fromFile('./components/comparisonSliderTable/index.html')
      .then((dom) => {
        // global.window = dom.window;
        // global.document = window.document;


        global.window = dom.window;
        global.document = dom.window.document;

        const resizeEvent = document.createEvent('Event');
        resizeEvent.initEvent('resize', true, true);
        
        global.window.resizeTo =  async (width, height) => {
          global.window.innerWidth = width || global.window.innerWidth;
          global.window.innerHeight = width || global.window.innerHeight;
          global.window.dispatchEvent(resizeEvent);
        };

      });
  });

  it ('render DOM, and match with ID', function () {
    const module = new comparisonSliderTable(id, responsive);
    expect(module.id).to.equal(id);
  });

  it ('should show one column, when window size between 500 to 890', async function() {
    window.resizeTo(690, 1000);
    await sleep(500);
    expect(document.querySelectorAll(id + ' table')[0].rows[0].cells[0].classList.contains('no-border-on-last-cell')).to.be.true;
  });

  it ('should show two column, when window size between 890px to 1024', async function() {
    window.resizeTo(900, 1000);
    await sleep(500);
    expect(document.querySelectorAll(id + ' table')[0].rows[0].cells[1].classList.contains('no-border-on-last-cell')).to.be.true;
  });
  it ('should show three column, when window size between 1024 and up', async function() {
    window.resizeTo(1300, 1000);
    await sleep(500);
    expect(document.querySelectorAll(id + ' table')[0].rows[0].cells[2].classList.contains('no-border-on-last-cell')).to.be.true;
  });
});