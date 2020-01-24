document.currentScript = document.currentScriptx || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();


var id = document.currentScript.getAttribute('id');

console.log(id + 'index2');