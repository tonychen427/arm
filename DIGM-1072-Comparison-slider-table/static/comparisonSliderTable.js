var comparisonSliderTable = (function () {

    var CLASSNAME_IS_ARROW_END = 'is-arrow-end';
    var CLASSNAME_IS_HIGHLIGHTED = 'is-highlighted';
    var CLASSNAME_IS_HIDDEN = 'is-hidden';
    var CLASSNAME_OFFSET_TOP = 'is-offset-top';
    var CLASSNAME_GROUP_TITLE = 'c-comparison-slider-table__group-title';
    var CLASSNAME_NO_BORDER_ON_LAST_CELL = 'no-border-on-last-cell';
    var CLASSNAME_NO_BORDER = 'c-comparison-slider-table__no-border';
    var CLASSNAME_SEPARATOR = 'c-comparison-slider-table__separator';
    var CLASSNAME_SCROLLBAR = 'c-comparison-slider-table__scrollbar';
    var CLASSNAME_MOBILE_SEPARATOR = 'c-comparison-slider-table__mobile-separator';
    var CLASSNAME_MOBILE_SEPARATOR_HIDDEN = 'c-comparison-slider-table__mobile-separator-hidden';


    function comparisonSliderTable(id, responsive) {
        if (id === null) return;
        this.id = '#' + id;
        this.myTable = document.querySelector(this.id + ' .c-comparison-slider-table__slider table');
        this.headerTitleList = document.querySelectorAll('.c-comparison-slider-table__header-title');
        this.myClone = this.myTable.cloneNode(true);
        this.maxNumberColumn = 3;
        this.scrollPosition = 1;
        this.mobileSelectedIndex1 = 1;
        this.mobileSelectedIndex2 = 2;

        this.numberTotalColumn = document.querySelectorAll(this.id + ' table')[0].rows[0].cells.length;
        this.responsive = responsive.sort(function (a, b) {
            return b.breakpoint - a.breakpoint;
        });

        this.buildHoverListener();
        this.buildNavigation();
        this.buildNavigationListener();
        this.buildResponsive();
        this.buildResponsiveListener();
        this.buildScrollBar();
        this.buildScrollBarListener();
        this.buildMobileDropdown();
        this.buildMobileDropdownListener();
    }

    comparisonSliderTable.prototype = {
        debounced: function (delay, fn) {
            var timerId;
            return function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (timerId) {
                    clearTimeout(timerId);
                }

                timerId = setTimeout(function () {
                    fn.apply(void 0, args);
                    timerId = null;
                }, delay);
            };
        },
        getColumnElementsByIndex: function (index) {
            return document.querySelectorAll(this.id + ' td:nth-child(' + index + ')');
        },
        setColumnWidth: function (index, width) {
            var elements = this.getColumnElementsByIndex(index);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].className.includes(CLASSNAME_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_SCROLLBAR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR_HIDDEN)) continue;
                elements[i].style = 'width: ' + width + '%';
            }
        },
        addClassNameToColumn: function (index, className) {
            var elements = this.getColumnElementsByIndex(index);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].className.includes(CLASSNAME_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_SCROLLBAR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR_HIDDEN)) continue;
                elements[i].classList.add(className);
            }
        },
        removeClassNameFromColumn: function (index, className) {
            var elements = this.getColumnElementsByIndex(index);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].className.includes(CLASSNAME_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_SCROLLBAR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR)) continue;
                if (elements[i].className.includes(CLASSNAME_MOBILE_SEPARATOR_HIDDEN)) continue;
                elements[i].classList.remove(className);
            }
        },
        getColumnIndex: function (element) {
            return parseInt(Array.prototype.indexOf.call(element.parentNode.children, element)) + 1
        },
        setAttributeByClassName: function (className, key, value) {
            var elements = document.getElementsByClassName(className);
            Array.prototype.forEach.call(elements, function (item) {
                item.setAttribute(key, value);
            });
        },
        moveColumnTo: function (firstIndexFrom, firstIndexTo, secondIndexFrom, secondIndexTo) {
            this.myTable.innerHTML = this.myClone.innerHTML;
            var table = document.querySelector(this.id + ' table');
            var rows = table.rows;
            for (var i = 0; i < rows.length; i++) {
                col = rows[i].children;
                for (var j = 0; j < col.length; j++) {
                    if (col[j].className.includes(CLASSNAME_SCROLLBAR)) continue;
                    col[j].classList.remove(CLASSNAME_IS_HIDDEN);
                }

                if (col[1].className.includes(CLASSNAME_SCROLLBAR) ||
                    col[1].className.includes(CLASSNAME_MOBILE_SEPARATOR)) continue;

                var temp1 = col[firstIndexFrom];
                var temp2 = col[secondIndexFrom];

                col[firstIndexFrom].parentNode.insertBefore(temp1, col[firstIndexTo]);
                col[secondIndexFrom].parentNode.insertBefore(temp2, col[secondIndexTo]);

                for (var j = 3; j < col.length; j++) {
                    if (col[j].className.includes(CLASSNAME_SCROLLBAR)) continue;
                    col[j].classList.add(CLASSNAME_IS_HIDDEN);
                }
            }
            this.buildHoverListener();
        },
        buildElement: function (el, attributes, text) {
            var element = document.createElement(el);
            var elementAttributes = Object.entries(attributes);
            for (var i = 0; i < elementAttributes.length; i++) {
                element.setAttribute(elementAttributes[i][0], elementAttributes[i][1]);
            }
            if (text !== undefined || text !== '') {
                element.innerHTML = text;
            }
            return element;
        },
        buildColumn: function (size) {
            for (var x = 1; x <= this.numberTotalColumn; x++) {
                if (x > size.settings.slidesToShow) {
                    this.addClassNameToColumn(x, CLASSNAME_IS_HIDDEN);
                } else {
                    this.removeClassNameFromColumn(x, CLASSNAME_IS_HIDDEN);
                }
                this.removeClassNameFromColumn(x, CLASSNAME_NO_BORDER_ON_LAST_CELL);
                this.setColumnWidth(x, Math.round(100 / this.maxNumberColumn));
            }
            var noBorderIndeColumn = this.maxNumberColumn >= this.numberTotalColumn ?
                this.numberTotalColumn : ((this.scrollPosition + this.maxNumberColumn) - 1);

            this.addClassNameToColumn(noBorderIndeColumn, CLASSNAME_NO_BORDER_ON_LAST_CELL);
        },
        buildHoverListener: function () {
            var self = this;
            var elements = document.querySelectorAll(this.id + ' td');

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                element.addEventListener('mouseover', function () {
                    if (this.className.includes(CLASSNAME_SEPARATOR) ||
                        this.className.includes(CLASSNAME_SCROLLBAR) ||
                        this.className.includes(CLASSNAME_NO_BORDER) ||
                        this.className.includes(CLASSNAME_GROUP_TITLE) ||
                        this.className.includes(CLASSNAME_MOBILE_SEPARATOR) ||
                        this.className.includes(CLASSNAME_MOBILE_SEPARATOR_HIDDEN)) return;
                    self.addClassNameToColumn(self.getColumnIndex(this), CLASSNAME_IS_HIGHLIGHTED);
                });
                element.addEventListener('mouseout', function () {
                    self.removeClassNameFromColumn(self.getColumnIndex(this), CLASSNAME_IS_HIGHLIGHTED);
                });
            }
        },
        buildNavigation: function () {
            var arrowNav = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav')[0];
            var arrowNavLeft = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav__left')[0];
            var arrowNavRight = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav__right')[0];

            if (arrowNav === undefined) return;
            if (arrowNavLeft === undefined || arrowNavRight === undefined) {
                arrowNav.classList.add(CLASSNAME_IS_HIDDEN);
                return;
            }

            if (this.maxNumberColumn >= this.numberTotalColumn) {
                arrowNav.classList.add(CLASSNAME_IS_HIDDEN);
            } else {
                arrowNav.classList.remove(CLASSNAME_IS_HIDDEN);
            }

            arrowNavLeft.classList.add(CLASSNAME_IS_ARROW_END);
            arrowNavRight.classList.remove(CLASSNAME_IS_ARROW_END);
        },
        buildNavigationListener: function () {
            var self = this;
            var arrowNav = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav')[0];
            var arrowNavLeft = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav__left')[0];
            var arrowNavRight = document.querySelectorAll(this.id + ' .c-comparison-slider-table__arrow-nav__right')[0];

            if (arrowNav === undefined) return;
            if (arrowNavLeft === undefined || arrowNavRight === undefined) {
                arrowNav.classList.add(CLASSNAME_IS_HIDDEN);
                return;
            }

            arrowNavLeft.addEventListener('click', function () {
                if (self.scrollPosition > 1) {
                    self.addClassNameToColumn(((self.scrollPosition - 2) + self.maxNumberColumn), CLASSNAME_NO_BORDER_ON_LAST_CELL);
                    self.addClassNameToColumn((self.scrollPosition + self.maxNumberColumn - 1), CLASSNAME_IS_HIDDEN);
                    self.removeClassNameFromColumn(self.scrollPosition - 1, CLASSNAME_IS_HIDDEN);
                    if (self.scrollPosition - 1 === 1) {
                        arrowNavRight.classList.remove(CLASSNAME_IS_ARROW_END);
                        arrowNavLeft.classList.add(CLASSNAME_IS_ARROW_END);
                    } else {
                        arrowNavRight.classList.remove(CLASSNAME_IS_ARROW_END);
                        arrowNavLeft.classList.remove(CLASSNAME_IS_ARROW_END);
                    }
                    self.scrollPosition--;
                }
            });

            arrowNavRight.addEventListener('click', function () {
                if ((self.scrollPosition + self.maxNumberColumn) <= self.numberTotalColumn) {
                    self.addClassNameToColumn((self.scrollPosition + self.maxNumberColumn), CLASSNAME_NO_BORDER_ON_LAST_CELL);
                    self.addClassNameToColumn(self.scrollPosition, CLASSNAME_IS_HIDDEN);
                    self.removeClassNameFromColumn(((self.scrollPosition + self.maxNumberColumn) - 1), CLASSNAME_NO_BORDER_ON_LAST_CELL);
                    self.removeClassNameFromColumn((self.scrollPosition + self.maxNumberColumn), CLASSNAME_IS_HIDDEN);
                    if ((self.scrollPosition + self.maxNumberColumn) === self.numberTotalColumn) {
                        arrowNavRight.classList.add(CLASSNAME_IS_ARROW_END);
                        arrowNavLeft.classList.remove(CLASSNAME_IS_ARROW_END);
                    } else {
                        arrowNavLeft.classList.remove(CLASSNAME_IS_ARROW_END);
                        arrowNavRight.classList.remove(CLASSNAME_IS_ARROW_END);
                    }
                    self.scrollPosition++;
                }
            });
        },
        buildResponsive: function () {
            var width = window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;

            if (width === null || width === undefined) return;

            this.scrollPosition = 1;

            for (let i = 0; i < this.responsive.length; i++) {
                const size = this.responsive[i];
                if (width >= size.breakpoint) {
                    this.setAttributeByClassName(CLASSNAME_SEPARATOR, 'colspan', size.settings.slidesToShow);
                    this.setAttributeByClassName(CLASSNAME_SCROLLBAR, 'colspan', size.settings.slidesToShow);
                    this.maxNumberColumn = size.settings.slidesToShow;
                    if ((this.numberTotalColumn < this.maxNumberColumn) || (width > 1570)) {
                        this.setAttributeByClassName(CLASSNAME_SEPARATOR, 'colspan', this.numberTotalColumn);
                        this.setAttributeByClassName(CLASSNAME_SCROLLBAR, 'colspan', size.settings.slidesToShow);
                    }

                    this.buildColumn(size);
                    return;
                }
            }
        },
        buildResponsiveListener: function () {
            var self = this;

            window.addEventListener('resize', self.debounced(100, function () {
                self.myTable.innerHTML = self.myClone.innerHTML;

                self.buildHoverListener();
                self.buildNavigation();
                self.buildNavigationListener();
                self.buildResponsive();
                self.buildNavigation();
                self.buildScrollBar();
                self.buildScrollBarListener();
                self.buildMobileDropdown();
            }))
        },
        buildScrollBar: function () {
            var scrollbarEl = document.querySelector('.c-comparison-slider-table__scrollbar');
            var scrollbarNoBorder = document.querySelector('.c-comparison-slider-table__scrollbar__no-border');

            var numberOfScrollClick = this.numberTotalColumn - (this.maxNumberColumn - 1);
            if (numberOfScrollClick === 1) {
                scrollbarEl.classList.add(CLASSNAME_IS_HIDDEN);
                scrollbarNoBorder.classList.add(CLASSNAME_IS_HIDDEN);
                return;
            }

            var inputComparisonScrollBar = this.buildElement('input', {
                id: 'comparisonTableScrollBar',
                max: numberOfScrollClick,
                min: '1',
                step: '1',
                name: 'scrollbar',
                type: 'range',
                list: 'question_three_list',
                value: '1'
            });

            while (scrollbarEl.firstChild) {
                scrollbarEl.removeChild(scrollbarEl.firstChild);
            }

            scrollbarEl.appendChild(inputComparisonScrollBar);

            var offsetHeight = document.querySelectorAll(this.id + ' table tr td')[0].offsetHeight
            scrollbarEl.setAttribute('style', 'top: ' + offsetHeight + 'px');
            scrollbarNoBorder.setAttribute('style', 'top: ' + offsetHeight + 'px');
        },
        buildScrollBarListener: function () {
            var self = this;
            var scrollBar = document.getElementById('comparisonTableScrollBar');
            if (scrollBar === null) return;
            scrollBar.addEventListener('change', function () {
                self.scrollPosition = this.value;
                for (var i = 2; i <= self.numberTotalColumn; i++) {
                    self.removeClassNameFromColumn(i, CLASSNAME_NO_BORDER_ON_LAST_CELL);
                    self.removeClassNameFromColumn(i, CLASSNAME_IS_HIDDEN);
                    if (i <= this.value) {
                        self.addClassNameToColumn(i, CLASSNAME_IS_HIDDEN);
                    }
                    if (i >= (parseInt(this.value) + (self.maxNumberColumn))) {
                        self.addClassNameToColumn(i, CLASSNAME_IS_HIDDEN);
                        self.addClassNameToColumn(i, CLASSNAME_NO_BORDER_ON_LAST_CELL);
                    }
                }
            });
        },
        buildMobileDropdown: function () {
            var select1 = document.querySelector('#select1');
            var select2 = document.querySelector('#select2');
            select1.innerHTML = '';
            select2.innerHTML = '';

            if (this.headerTitleList.length < 3) {
                var offsetElement = document.querySelectorAll('.c-comparison-slider-table__card');
                for (var i = 0; i < offsetElement.length; i++) {
                    offsetElement[i].classList.add(CLASSNAME_OFFSET_TOP);
                }
                document.querySelector('.c-comparison-slider-table__mobile-dropdown').classList.add(CLASSNAME_IS_HIDDEN);
                return;
            }

            for (var i = 1; i <= this.headerTitleList.length; i++) {
                if (i !== parseInt(this.mobileSelectedIndex2)) {
                    select1.add(this.buildElement('option', i === parseInt(this.mobileSelectedIndex1) ? {
                        value: i,
                        selected: 'selected'
                    } : {
                        value: i
                    }, this.headerTitleList[i - 1].innerHTML));
                }

                if (i !== parseInt(this.mobileSelectedIndex1)) {
                    select2.add(this.buildElement('option', i === parseInt(this.mobileSelectedIndex2) ? {
                        value: i,
                        selected: 'selected'
                    } : {
                        value: i
                    }, this.headerTitleList[i - 1].innerHTML));
                }
            }
        },
        buildMobileDropdownListener: function () {
            var self = this;
            var select1 = document.querySelector('#select1');
            var select2 = document.querySelector('#select2');

            select1.addEventListener('change', function () {
                self.mobileSelectedIndex1 = this.value;
                self.buildMobileDropdown();
                self.moveColumnTo(self.mobileSelectedIndex1, 1, self.mobileSelectedIndex2, 2);
            });

            select2.addEventListener('change', function () {
                self.mobileSelectedIndex2 = this.value;
                self.buildMobileDropdown();
                self.moveColumnTo(self.mobileSelectedIndex1, 1, self.mobileSelectedIndex2, 2);
            });
        }
    }

    return comparisonSliderTable;
})();


var responsive = [{
        breakpoint: 1230, // screens greater than >= 1024px
        settings: {
            slidesToShow: 4,
        }
    },
    {
        breakpoint: 1024,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 924,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 767,
        settings: {
            slidesToShow: 3,
        }
    },
    {
        breakpoint: 370,
        settings: {
            slidesToShow: 3,
        }
    }
];

// Polyfill for ie 11 - string.includes
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) {
            start = 0;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Polyfill for ie 11 - Object.entries
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}
if (typeof document !== 'undefined') {

    document.currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    var comparisonSliderTableId = document.currentScript.getAttribute('id');
    document.addEventListener('DOMContentLoaded', function () {
        var id = comparisonSliderTableId
        var c = new comparisonSliderTable(id, responsive);

        var elements = document.querySelectorAll('.c-comparison-slider-table__arrow-nav');
        Stickyfill.add(elements);
    });

}

var _export = typeof module !== 'undefined' ? module.exports : {};
_export.comparisonSliderTable = comparisonSliderTable;
