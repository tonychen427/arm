/**
 * twoColumnMobileTabs
 *
 * @description The twoColumnMobileTabs component.
 * @param {Object} options The options hash
 */
var twoColumnMobileTabs = (function (options) {
    debugger;
    var id = options.id;
    var el = document.querySelector('#' + id + ' ' + options.tabContents);
    var tabNavigationLinks = el.querySelectorAll(options.tabNavigationLinks);
    var tabContentContainers = el.querySelectorAll(options.tabContentContainers);
    var activeIndex = 0;
    var initCalled = false;
    var isActive = 'is-active';
    /**
     * init
     *
     * @description Initializes the component by removing the no-js class from
     *   the component, and attaching event listeners to each of the nav items.
     *   Returns nothing.
     */
    var init = function () {
        if (!initCalled) {
            initCalled = true;
            el.classList.remove('no-js');

            for (var i = 0; i < tabNavigationLinks.length; i++) {
                var link = tabNavigationLinks[i];
                handleClick(link, i);
            }
        }
    };

    /**
     * handleClick
     *
     * @description Handles click event listeners on each of the links in the
     *   tab navigation. Returns nothing.
     * @param {HTMLElement} link The link to listen for events on
     * @param {Number} index The index of that link
     */
    var handleClick = function (link, index) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            setAriaSelected(e);
            goToTab(index);
        });
        link.addEventListener

        link.addEventListener('keydown', function (e) {
            if (e.keyCode === 13 && e.target.nodeName === 'DIV') {
                e.preventDefault();
                setAriaSelected(e);
                goToTab(index);
            }
        });
    };

    /**
     * goToTab
     *
     * @description Goes to a specific tab based on index. Returns nothing.
     * @param {Number} index The index of the tab to go to
     */
    var goToTab = function (index) {
        if (index !== activeIndex && index >= 0 && index <= tabNavigationLinks.length) {
            tabNavigationLinks[activeIndex].classList.remove(isActive);
            tabNavigationLinks[index].classList.add(isActive);
            tabContentContainers[activeIndex].classList.remove(isActive);
            tabContentContainers[index].classList.add(isActive);
            activeIndex = index;
        }
    };

     /**
     * setAriaSelected
     *
     * @description set aria selected to true. Returns nothing.
     * @param {Element} element The element of the tab selected
     */
    var setAriaSelected = function (element) {
        var className = element.target.classList[0];
        var elements = document.getElementsByClassName(className);
        Array.prototype.forEach.call(elements, function (item) {
            item.setAttribute('aria-selected', "false");
        });

        element.target.setAttribute('aria-selected',"true")
    }

    /**
     * Returns init and goToTab
     */
    return {
        id: id,
        init: init,
        goToTab: goToTab
    };

});
// End twoColumnMobileTabs.js

/**
 * Attach to global namespace
 * 
 */
if (typeof window !== 'undefined') {
    window.twoColumnMobileTabs = twoColumnMobileTabs;
}

if (typeof document !== 'undefined') {

    document.currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
debugger;
    var id = document.currentScript.getAttribute('id');
    var twoColumnMobileTabsId = id !== '' ? id : '';

    document.addEventListener('DOMContentLoaded', function () {
        var myTabs1 = new twoColumnMobileTabs({
            id: twoColumnMobileTabsId,
            tabContents: '.c-two-column-mobile-tabs__contents',
            tabNavigationLinks: '.c-two-column-mobile-tabs__link',
            tabContentContainers: '.c-two-column-mobile-tabs__content'
        });

        myTabs1.init();
    });
}

var _export = typeof module !== 'undefined' ? module.exports : {};
_export.twoColumnMobileTabs = twoColumnMobileTabs;
