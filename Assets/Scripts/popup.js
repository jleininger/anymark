window.onload = function() {
    var mainMenus = document.getElementsByClassName('main-menu'),
        header = document.getElementById('mainHeader'),
        footer = document.getElementsByTagName('footer')[0];

    if(chrome.extension.getBackgroundPage().bookmarks.pageInfo.isIncognito) {
        header.style.backgroundColor = "#191919";
        footer.style.backgroundColor = "#191919";

        for (var i = 0; i < mainMenus.length; i++) {
            mainMenus[i].className += " main-menu-incognito";
        }
    }
};