var bookmarks = {
    pageInfo: {
        isIncognito: false
    },
    firstTime: false,
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
    messageListener: function(message, sender, sendResponse) {
        if(message.action === 'openUrl') {
            chrome.tabs.create({url: message.url});
        } else if(message.action === 'instructionsRead') {
            bookmarks.firstTime = false;
        }
    },
    updateListener: function(windowId) {
        if(windowId === -1) {
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
                if (tabs.length > 0 && tabs[0].incognito) {
                    console.log("Tab is incognito: ", tabs[0].incognito);
                    bookmarks.pageInfo.isIncognito = tabs[0].incognito;
                }
            });
        }
    },
    installListener: function(details) {
        if(details && details.reason === 'install') {
            bookmarks.firstTime = true;
        }
    },
    run: function() {
        //Menus
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

        //Listeners
        chrome.runtime.onMessage.addListener(bookmarks.messageListener);
        chrome.tabs.onUpdated.addListener(bookmarks.updateListener);
        chrome.windows.onFocusChanged.addListener(bookmarks.updateListener);
        chrome.runtime.onInstalled.addListener(bookmarks.installListener);
    }
};

//Pages
bookmarks.pages = {
    createBookmark: function(pageUrl, pageTitle) {
        var pageName = window.prompt("Name this page.", pageTitle),
            page = {
                key: pageName,
                value: pageUrl,
                isIncognito: bookmarks.pageInfo.isIncognito
            };
        return page;
    },
    bookmark: function(info) {
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            var currentTab = tabs[0],
                page = bookmarks.pages.createBookmark(info.pageUrl, currentTab.title);

            if(page.key) {
                bookmarks.getSavedBookmarks('Pages', function(savedBookmarks) {
                    if(savedBookmarks) {
                        savedBookmarks.push(page);
                        bookmarks.saveBookmarks({'Pages': savedBookmarks});
                    } else {
                        bookmarks.alertUser("Unable to bookmark this page!");
                    }
                });
            }
        });
    }
};

//Photos
bookmarks.photos = {
    bookmark: function(info) {
        bookmarks.getSavedBookmarks('Photos', function(savedBookmarks) {
            if(savedBookmarks) {
                savedBookmarks.push({url: info.srcUrl, isIncognito: bookmarks.pageInfo.isIncognito});
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
                savedBookmarks.push({url: info.srcUrl, isIncognito: bookmarks.pageInfo.isIncognito});
                bookmarks.saveBookmarks({'Videos': savedBookmarks});
            } else {
                bookmarks.alertUser("Unable to bookmark this video!");
            }
        });
    }
};

window.onload = bookmarks.run;