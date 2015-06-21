var bookmarks = {};



bookmarks.createPageBookmark = function(pageUrl, pageTitle) {
    var pageName = window.prompt("Name this page.", pageTitle),
        page = {
            key: pageName,
            value: pageUrl
        };
    return page;
};

bookmarks.bookmarkPage = function(info) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        //Create the new page
        var currentTab = tabs[0],
            page = bookmarks.createPageBookmark(info.pageUrl, currentTab.title);
        //Save the page to the database
        chrome.storage
    });
};

bookmarks.run = function() {
    chrome.contextMenus.create({
        title: "Bookmark current page",
        contexts: ['page'],
        onclick: bookmarks.bookmarkPage
    });
};

window.onload = bookmarks.run;