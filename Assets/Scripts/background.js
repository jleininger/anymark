var bookmarks = {
    //Shared functions for all bookmark types
    getSavedBookmarks: function(bookmarkType, next) {
        chrome.storage.sync.get(bookmarkType, function(result) {
            if (chrome.runtime.lastError) {
                console.error("Unable to retrieve the bookmarks!");
                return;
            }

            var bookmarks = result[bookmarkType] || [];

            next(bookmarks);
        });
    },
    saveBookmarks: function(bookmarks) {
        chrome.storage.sync.set(bookmarks, function() {
            //console.log("Bookmark saved!");
        });
    },
    clearAllBookmarks: function() {
        chrome.storage.sync.clear(function() {
            console.log("All bookmarks cleared!");
        });
    },
    alertUser: function(message) {
        window.alert(message);
    },
    messageListener: function(message) {
        if(message.action === 'openUrl') {
            chrome.tabs.create({url: message.url});
        }
    },
    run: function() {
        chrome.contextMenus.create({
            title: "Bookmark this page",
            contexts: ['page'],
            onclick: bookmarks.pages.bookmark
        });

        chrome.contextMenus.create({
            title: "Bookmark this photo",
            contexts: ['image'],
            onclick: bookmarks.photos.bookmark
        });

        chrome.contextMenus.create({
            title: "Bookmark this video",
            contexts: ['video'],
            onclick: bookmarks.videos.bookmark
        });

        chrome.runtime.onMessage.addListener(bookmarks.messageListener);

        chrome.tabs.onCreated.addListener(function(tab) {
            console.log('This tab is: ' + ((tab.incognito) ? 'in incognito' : 'is not in incognito'));
        });
    }
};

//Pages
bookmarks.pages = {
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

            bookmarks.getSavedBookmarks('Pages', function(savedBookmarks) {
                if(savedBookmarks) {
                    savedBookmarks.push(page);
                    bookmarks.saveBookmarks({'Pages': savedBookmarks});
                } else {
                    bookmarks.alertUser("Unable to bookmark this page!");
                }
            });
        });
    }
};

//Photos
bookmarks.photos = {
    bookmark: function(info) {
        bookmarks.getSavedBookmarks('Photos', function(savedBookmarks) {
            if(savedBookmarks) {
                savedBookmarks.push(info.srcUrl);
                bookmarks.saveBookmarks({'Photos': savedBookmarks});
            } else {
                bookmarks.alertUser("Unable to bookmark this photo!");
            }
        });
    }
};

//Videos
bookmarks.videos = {
    bookmark: function(info) {
        bookmarks.getSavedBookmarks('Videos', function(savedBookmarks) {
            if(savedBookmarks) {
                savedBookmarks.push(info.srcUrl);
                bookmarks.saveBookmarks({'Videos': savedBookmarks});
            } else {
                bookmarks.alertUser("Unable to bookmark this video!");
            }
        });
    }
};

window.onload = bookmarks.run;