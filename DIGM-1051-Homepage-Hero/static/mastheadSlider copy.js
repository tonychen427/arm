var MastheadSlider = (function () {

    function getdef(val, def) {
        return val == null ? def : val;
    }

    function len(arr) {
        return (arr || []).length;
    }

    function startSlides(containerElem, children, unit, startVal, visVal, trProp) {
        var style = void 0,
            slides = [];

        if (!children) {
            children = containerElem.children;
        }

        var i = len(children);

        while (--i >= 0) {
            slides[i] = children[i];
            style = slides[i].style;
            style.position = 'absolute';
            style.top = style.left = style.zIndex = 0;
            style[trProp] = startVal + unit;
        }

        style[trProp] = visVal + unit;
        style.zIndex = 1;

        return slides;
    }

    function defaultEase(time, begin, change, duration) {
        return (time = time / (duration / 2)) < 1 ? change / 2 * time * time * time + begin : change / 2 * ((time -= 2) * time * time + 2) + begin;
    }

    function MastheadSlider(options) {
        options = options || {};
        var actualIndex = void 0,
            interval = void 0,
            intervalStartTime = void 0,
            slides = void 0,
            remainingTime = void 0;

        var containerElem = getdef(options.container, document.querySelector('*[data-masthead-slider]'));
        var trProp = getdef(options.prop, 'left');
        var trTime = getdef(options.duration, 0.5) * 1000;
        var delay = getdef(options.delay, 3) * 1000;
        var unit = getdef(options.unit, '%');
        var startVal = getdef(options.init, -100);
        var visVal = getdef(options.show, 0);
        var endVal = getdef(options.end, 100);
        var paused = options.paused;
        var ease = getdef(options.ease, defaultEase);
        var onChange = getdef(options.onChange, 0);
        var onChangeEnd = getdef(options.onChangeEnd, 0);
        var now = Date.now;

        function reset() {
            if (len(containerElem.children) > 0) {
                var style = containerElem.style;
                style.position = 'relative';
                style.overflow = 'hidden';
                style.display = 'block';

                slides = startSlides(containerElem, options.children, unit, startVal, visVal, trProp);
                actualIndex = 0;
                remainingTime = delay;
            }
        }

        function setAutoPlayLoop() {
            intervalStartTime = now();
            interval = setTimeout(function () {
                intervalStartTime = now();
                remainingTime = delay;

                change(nextIndex());

                setAutoPlayLoop();
            }, remainingTime);
        }

        function resume() {
            if (isAutoPlay()) {
                if (interval) {
                    clearTimeout(interval);
                }

                setAutoPlayLoop();
            }
        }

        function isAutoPlay() {
            return !paused && len(slides) > 1;
        }

        function pause() {
            if (isAutoPlay()) {
                remainingTime = delay - (now() - intervalStartTime);
                clearTimeout(interval);
                interval = 0;
            }
        }

        function reverse() {
            var newEndVal = startVal;
            startVal = endVal;
            endVal = newEndVal;
            actualIndex = Math.abs(actualIndex - (len(slides) - 1));
            slides = slides.reverse();
        }

        function change(newIndex) {
            var count = len(slides);
            while (--count >= 0) {
                slides[count].style.zIndex = 1;
            }

            slides[newIndex].style.zIndex = 3;
            slides[actualIndex].style.zIndex = 2;

            anim(slides[actualIndex].style, visVal, endVal, slides[newIndex].style, startVal, visVal, trTime, 0, 0, ease);

            actualIndex = newIndex;

            if (onChange) {
                onChange(prevIndex(), actualIndex);
            }
        }

        function next() {
            change(nextIndex());
            resume();
        }

        function prev() {
            change(prevIndex());
            resume();
        }

        function nextIndex() {
            var newIndex = actualIndex + 1;
            return newIndex >= len(slides) ? 0 : newIndex;
        }

        function prevIndex() {
            var newIndex = actualIndex - 1;
            return newIndex < 0 ? len(slides) - 1 : newIndex;
        }

        function dispose() {
            clearTimeout(interval);
            document.removeEventListener('visibilitychange', visibilityChange);

            slides = containerElem = interval = trProp = trTime = delay = startVal = endVal = paused = actualIndex = remainingTime = onChange = onChangeEnd = null;
        }

        function currentIndex() {
            return actualIndex;
        }

        function anim(insertElem, insertFrom, insertTo, removeElem, removeFrom, removeTo, transitionDuration, startTime, elapsedTime, easeFunc) {
            function setProp(elem, from, to) {
                elem[trProp] = easeFunc(elapsedTime - startTime, from, to - from, transitionDuration) + unit;
            }

            if (startTime > 0) {
                if (elapsedTime - startTime < transitionDuration) {
                    setProp(insertElem, insertFrom, insertTo);
                    setProp(removeElem, removeFrom, removeTo);
                } else {
                    insertElem[trProp] = insertTo + unit;
                    removeElem[trProp] = removeTo + unit;

                    if (onChangeEnd) {
                        onChangeEnd(actualIndex, nextIndex());
                    }

                    return;
                }
            }

            requestAnimationFrame(function (time) {
                if (startTime === 0) {
                    startTime = time;
                }

                anim(insertElem, insertFrom, insertTo, removeElem, removeFrom, removeTo, transitionDuration, startTime, time, easeFunc);
            });
        }

        function visibilityChange() {
            if (document.hidden) {
                pause();
            } else {
                resume();
            }
        }

        document.addEventListener('visibilitychange', visibilityChange);
        reset();

        if (len(slides) > 1) {
            resume();
        }

        return {
            currentIndex: currentIndex,
            pause: pause,
            resume: resume,
            nextIndex: nextIndex,
            prevIndex: prevIndex,
            next: next,
            prev: prev,
            change: change,
            reverse: reverse,
            dispose: dispose
        };
    }

    return MastheadSlider
})();

if (typeof document !== 'undefined') {

    document.currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    var componentId = document.currentScript.getAttribute('id');
    var indicators = document.querySelectorAll('.c-masthead__indicators > li.dot');
    var pauseBtn = document.querySelector('.c-masthead__indicators .action .fa-pause');

    function carouselControlPause() {
        pauseBtn.classList.remove('fa-play');
        pauseBtn.classList.add('fa-pause');
    }

    function carouselControlPlay() {
        pauseBtn.classList.remove('fa-pause');
        pauseBtn.classList.add('fa-play');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var sliderContainer = document.querySelector('#' + componentId + ' .c-masthead-slider');
        var slider = new MastheadSlider({
            container: sliderContainer,
            init: 100,
            show: 0,
            end: -100,
            unit: '%',
            delay: 4,
            onChangeEnd: function (index) {
                for (var i = 0; i < indicators.length; i++) {
                    indicators[i].classList.remove('active')
                }
                indicators[index].classList.add('active')
            }
        });

        function indicatorsSlideTo() {
            var slideTo = parseInt(this.dataset.slideTo);
            if (slider.currentIndex() === slideTo - 1) return;
            slider.change(slideTo - 1);
            slider.pause();
            carouselControlPlay();
        }

        function indicatorsPauseResume() {
            if (pauseBtn.classList.contains('fa-pause')) {
                slider.pause();
                carouselControlPlay();
            } else {
                slider.resume();
                carouselControlPause();
            }
        }

        for (var i = 0; i < indicators.length; i++) {
            indicators[i].addEventListener('click', indicatorsSlideTo, false);
            indicators[i].addEventListener('keypress', indicatorsSlideTo, false);
        }

        pauseBtn.addEventListener('click', indicatorsPauseResume, false);
    });
}

var _export = typeof module !== 'undefined' ? module.exports : {};
_export.MastheadSlider = MastheadSlider;