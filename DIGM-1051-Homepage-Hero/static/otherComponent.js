
var OtherCompoent = (function () {

})();



if (typeof document !== 'undefined') {

    document.currentScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    var componentId_otherComponent = document.currentScript.getAttribute('id');

    document.addEventListener('DOMContentLoaded', function () {
        console.log(componentId_otherComponent)
    });
}

var _export = typeof module !== 'undefined' ? module.exports : {};
_export.OtherCompoent = OtherCompoent;
