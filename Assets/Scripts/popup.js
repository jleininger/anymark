window.onload = function() {
    var mainMenus = document.getElementsByClassName('main-menu'),
        header = document.getElementById('mainHeader'),
        footer = document.getElementsByTagName('footer')[0],
        exitIcon = document.getElementById('exitIcon'),
        mainPopup = document.getElementById('mainPopup'),
        welcomeMsg = document.getElementById('welcomeMsg'),
        allowLink = document.getElementById('allowLink'),
        backgroundPage = chrome.extension.getBackgroundPage();

    if(backgroundPage.bookmarks.firstTime) {
        mainPopup.style.display = 'none';
        welcomeMsg.style.display = 'block';
        exitIcon.addEventListener('click', removeWelcome);
        allowLink.addEventListener('click', openExtensionPage);
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

function openExtensionPage() {
    removeWelcome();
    chrome.tabs.create({url: 'chrome://extensions/'});
}

function removeWelcome() {
    mainPopup.style.display = 'block';
    welcomeMsg.style.display = 'none';
}