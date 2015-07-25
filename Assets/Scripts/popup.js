window.onload = function() {
    if(chrome.extension.getBackgroundPage().bookmarks.pageInfo.isIncognito) {
        document.getElementById('mainHeader').style.backgroundColor = "#191919";
        document.getElementsByTagName('footer')[0].style.backgroundColor = "#191919";
        document.getElementById('pagesMenu').className += " main-menu-incognito";
        document.getElementById('photosMenu').className += " main-menu-incognito";
        document.getElementById('videosMenu').className += " main-menu-incognito";
        document.getElementById('settingsMenu').className += " main-menu-incognito";
    }
};