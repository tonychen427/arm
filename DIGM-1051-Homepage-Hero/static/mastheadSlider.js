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
            if (containerElem && len(containerElem.children) > 0) {
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
            if (slides === undefined) return;  
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
                    indicatorSetActive(actualIndex)
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

        // The visibilitychange event is fired at the document when the content of its tab have become visible or have been hidden.
        // document.addEventListener('visibilitychange', visibilityChange);
        reset();

        if (len(slides) > 1) {
            resume();
        }

        // indicator

        var prefixes = 'c-masthead__indicators__action__';
        var indicatorPlay = prefixes + 'play';
        var indicatorPause = prefixes + 'pause';
        var indicatorActive = 'active';

        var indicator = document.createElement('ol');
        indicator.className = 'c-masthead__indicators';

        var actionElem = document.createElement('li');
        actionElem.className = 'c-masthead__indicators__action';
        actionElem.setAttribute('data-slide-to', 0);
        actionElem.setAttribute('tabindex', 0);

        var pausePlayElem =  document.createElement('div');
        pausePlayElem.className = 'c-masthead__indicators__action__pause';

        actionElem.appendChild(pausePlayElem);
        indicator.appendChild(actionElem);

        var sliderId = options.id !== '' ? '#' + options.id : '';
        var sliderContainer = document.querySelector(sliderId + ' .c-masthead__slider');
        
        for (var i = 0; i < sliderContainer.children.length; i++) {
            var dotElem = document.createElement('li');
            dotElem.className = 'c-masthead__indicators__dot';
            dotElem.setAttribute('data-slide-to', i +  1);
            dotElem.setAttribute('tabindex', 0);
            indicator.appendChild(dotElem);
        }

        if (sliderContainer.children.length > 1) {
            document.querySelector('.c-masthead').appendChild(indicator);
        }

        var indicatorElem = document.querySelectorAll(sliderId + ' .c-masthead__indicators > li.c-masthead__indicators__dot');
        var pauseResumeElem = document.querySelector(sliderId + ' .c-masthead__indicators .c-masthead__indicators__action__pause');
       
        function indicatorsControlPause() {
            pauseResumeElem.classList.remove(indicatorPlay);
            pauseResumeElem.classList.add(indicatorPause);
        }

        function indicatorsControlPlay() {
            pauseResumeElem.classList.remove(indicatorPause);
            pauseResumeElem.classList.add(indicatorPlay);
        }

        function indicatorSetActive(index) {
            if (!!indicatorElem) {
                for (var i = 0; i < indicatorElem.length; i++) {
                    indicatorElem[i].classList.remove(indicatorActive);
                }
                indicatorElem[index].classList.add(indicatorActive);
            }
        }

        function indicatorsSlideTo() {
            var slideTo = parseInt(this.dataset.slideTo);
            if (currentIndex() === slideTo - 1) return;
            change(slideTo - 1);
            pause();
            indicatorSetActive(slideTo - 1);
            indicatorsControlPlay();
        }

        function indicatorsPauseResume() {
            if (pauseResumeElem.classList.contains(indicatorPause)) {
                pause();
                indicatorsControlPlay();
            } else {
                resume();
                indicatorsControlPause();
            }
        }

        if (!!indicatorElem) {
            if (indicatorElem.length === 0) return;
            for (var i = 0; i < indicatorElem.length; i++) {
                indicatorElem[i].addEventListener('click', indicatorsSlideTo, false);
                indicatorElem[i].addEventListener('keypress', indicatorsSlideTo, false);
            }

            pauseResumeElem.addEventListener('click', indicatorsPauseResume, false);
            indicatorElem[0].classList.add(indicatorActive);
        }

        return {
            id: options.id,
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

    var id = document.currentScript.getAttribute('id');
    var mastheadComponentId = id !== '' ? '#' + id : '';
    
    document.addEventListener('DOMContentLoaded', function () {
        var sliderContainer = document.querySelector(mastheadComponentId + ' .c-masthead__slider');
        var slider = new MastheadSlider({
            id: id,
            container: sliderContainer,
            init: 100,
            show: 0,
            end: -100,
            unit: '%',
            delay: 4
        });
    });
}

var _export = typeof module !== 'undefined' ? module.exports : {};
_export.MastheadSlider = MastheadSlider;
