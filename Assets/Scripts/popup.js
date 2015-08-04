window.onload = function() {
    var mainMenus = document.getElementsByClassName('main-menu'),
        header = document.getElementById('mainHeader'),
        footer = document.getElementsByTagName('footer')[0],
        backgroundPage = chrome.extension.getBackgroundPage();

    if(backgroundPage.bookmarks.firstTime) {
        window.alert('This is your first time!');
        chrome.runtime.sendMessage({action: 'instructionsRead'});
    }

    if(backgroundPage.bookmarks.pageInfo.isIncognito) {
        header.style.backgroundColor = "#191919";
        footer.style.backgroundColor = "#191919";

        for (var i = 0; i < mainMenus.length; i++) {
            mainMenus[i].className += " main-menu-incognito";
        }
    }
};