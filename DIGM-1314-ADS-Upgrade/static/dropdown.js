(function () {
    var position = 1;
    var dropdownType = "inverted";

    var isAlertBanner = !true;
    // var viewModel = {
    //     "Default": {
    //         "Label": "English",
    //         "Value": "en",
    //         "Icon": "fas fa-globe"
    //     },
    //     "Items": [{
    //         "Label": "English",
    //         "Value": "en",
    //         "Icon": null
    //     }, {
    //         "Label": "日本語",
    //         "Value": "ja",
    //         "Icon": null
    //     }]
    // };
    var viewModel = {
        "default": {
          "label": "English",
          "value": "en",
          "icon": "fas fa-globe",
        },
        "items": [
          {
            "label": "Japanese",
            "value": "jp",
            "icon": ""
          },
          {
            "label": "Chinese",
            "value": "cn",
            "icon": ""
          },
          {
            "label": "English",
            "value": "en",
            "icon": ""
          },
          {
            "label": "German",
            "value": "de",
            "icon": ""
          }
        ]
      };



    var language = ConvertKeysToLowerCase(viewModel);
    var selectedData = language.default;

    function ConvertKeysToLowerCase(obj) {
        var json = JSON.stringify(obj);
        var newJson = json.replace(/"([\w]+)":/g,
            function ($0, $1) {
                return ('"' + $1.toLowerCase() + '":');
            });
        return JSON.parse(newJson);
    };

    function buildLocalization(locale, url) {
        var pathArray = url.split('/');
        var secondLevelLocation = pathArray[position];
        var found = false;
        for (var i = 0; i < language.items.length; i++) {
            if (language.items[i].value == secondLevelLocation) {
                found = true;
                break;
            }
        }
        var urlPath = found ? '/' + pathArray.slice(position + 1, pathArray.length).join('/') : url;
        return '/' + locale + urlPath;
    }

    function redirectPath(value) {
        var url = new URL(window.location.href);
        var redirectUrl = url.origin + buildLocalization(value, url.pathname);
        return redirectUrl;
    }

    function setCookie(cname, cvalue) {
        var expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (3650 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + expiryDate.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    var dropdownId = isAlertBanner ? '#alert-language-dropdown' : '#footer-language-dropdown';
    var dropdown = document.querySelector(dropdownId);
    if (dropdown) {
        dropdown.type = dropdownType;
        dropdown.data = viewModel;
        dropdown.addEventListener('adsDropdownOnChanged',
            function (evt) {
                selectedData = evt.detail;
                if (!isAlertBanner) {
                    document.cookie = setCookie('language-banner', selectedData.value);
                    window.location.href = redirectPath(selectedData.value);
                }
            });
    }

    if (isAlertBanner) {
        var alertTop = document.querySelector('#alert-top');
        if (alertTop) {
            alertTop.addEventListener('adsCloseButtonClicked',
                function () {
                    alertTop.close();
                });
        }

        var confirmButton = document.querySelector('#c-language-switcher__alert__button_id');
        if (confirmButton) {
            confirmButton.addEventListener('click',
                function () {
                    document.cookie = setCookie('language-banner', selectedData.value);
                    window.location.href = redirectPath(selectedData.value);
                });
        }
    }

})();