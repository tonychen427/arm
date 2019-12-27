const jsdom = require("jsdom");
const {
  expect
} = require("chai");
const {
  JSDOM
} = jsdom;

var {
  MastheadSlider
} = require('../static/mastheadSlider.js');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
describe('Masthead-Slider', function () {
  before(function () {
    return JSDOM.fromFile('./src/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = window.document;
        global.requestAnimationFrame = cb => cb();
      });
  })

  it('render DOM, and match with ID', function () {
    var componentId = "c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8";
    var slider = new MastheadSlider({
      id: componentId,
      init: 100,
      show: 0,
      end: -100,
      unit: '%',
      delay: 4
    });
    expect(slider.id).to.equal(componentId);
  });

  describe('Slider', function() {
    it('should have same number of slider as indicator', function () {
      expect(document.querySelectorAll('.c-masthead__slider__item').length).to.equal(document.querySelectorAll('.c-masthead__indicators > li.c-masthead__indicators__dot').length);
    });
  });

  describe('Indicator', function () {
    it('should update class name to "play", when pause button is click', function () {
      expect(document.querySelector('#c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8 .c-masthead__indicators__action').children[0].className).to.equal('c-masthead__indicators__action__pause');

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      document.querySelector('#c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8 .c-masthead__indicators__action__pause').dispatchEvent(evt);

      expect(document.querySelector('#c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8 .c-masthead__indicators__action').children[0].className).to.equal('c-masthead__indicators__action__play');
    });


    it('should update class name to "active", when click on the 2nd indicator dot', function () {

      var indicatorDots = document.querySelectorAll('#c-c90a40e7-fc69-49c3-860c-5d8e6f2a46b8 .c-masthead__indicators > li.c-masthead__indicators__dot');
      expect(indicatorDots[0].className).to.include('active')

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      indicatorDots[1].dispatchEvent(evt)

      expect(indicatorDots[0].className).not.to.include('active')
      expect(indicatorDots[1].className).to.include('active')
    });
  });

});