var bookmarks = {
    //Shared functions for all bookmark types
    getSavedBookmarks: function(bookmarkType, next) {
        chrome.storage.sync.get(bookmarkType, function(result) {
            if (chrome.runtime.lastError) {
                console.error("Unable to retrieve the bookmarks!");
                return;
            }

            console.log(result.length);
            var bookmarks = result[bookmarkType] || [];
            //TODO: For testing only. Remove
            console.log("Current bookmarks: " + bookmarks);

            next(bookmarks);
        });
    },
    saveBookmarks: function(bookmarkType, bookmarks) {
        chrome.storage.sync.set({bookmarkType: bookmarks}, function() {
            console.log(bookmarkType + " bookmarks saved!");
        });
    }
};

//Pages
bookmarks.pages = {
    bookmarkType: 'Pages',
    createBookmark: function(pageUrl, pageTitle) {
        var pageName = window.prompt("Name this page.", pageTitle),
            page = {
                key: pageName,
                value: pageUrl
            };
        return page;
    },
    bookmark: function(info) {
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            var currentTab = tabs[0],
                page = bookmarks.pages.createBookmark(info.pageUrl, currentTab.title);

            bookmarks.getSavedBookmarks(bookmarks.pages.bookmarkType, function(savedBookmarks) {
                if(savedBookmarks) {
                    savedBookmarks.push(page);
                    bookmarks.saveBookmarks(bookmarks.pages.bookmarkType, savedBookmarks);
                } else {
                    window.alert("Unable to retrieve the bookmark! Please try again later.");
                }
            });
        });
    }
};

bookmarks.run = function() {
    chrome.contextMenus.create({
        title: "Bookmark current page",
        contexts: ['page'],
        onclick: bookmarks.pages.bookmark
    });
};

window.onload = bookmarks.run;