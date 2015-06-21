var bookmarks = {};

bookmarks.bookmarkPage = function(info) {
    chrome.tabs.query({ currentWindow: true. active: true }, function(tabs) {

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