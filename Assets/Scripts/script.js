var Page = React.createClass({
    displayName: 'Page',
    render: function() {
        var title = this.props.title,
            url = this.props.url,
            index = this.props.index,
            openUrl = this.props.openUrl,
            dragBookmark = this.props.dragBookmark,
            dropBookmark = this.props.dropBookmark;

        return React.createElement(
            'div',
            { className: 'main-menu', onClick: openUrl.bind(null, url), draggable: true, onDragStart: dragBookmark.bind(null, index), onDragEnd: dropBookmark },
            React.createElement('h2', null, title)
        );
    }
});

var Photo = React.createClass({
    displayName: 'Photo',
    render: function() {
        var url = this.props.url,
            index = this.props.index,
            openUrl = this.props.openUrl,
            dragBookmark = this.props.dragBookmark,
            dropBookmark = this.props.dropBookmark;

        return React.createElement('img', {className: 'photo', src: url, onClick: openUrl.bind(null, url), draggable: true, onDragStart: dragBookmark.bind(null, index), onDragEnd: dropBookmark}, null);
    }
});

var Video = React.createClass({
    displayName: 'Video',
    render: function() {
        var url = this.props.url,
            index = this.props.index,
            openUrl = this.props.openUrl,
            dragBookmark = this.props.dragBookmark,
            dropBookmark = this.props.dropBookmark;

        return React.createElement(
            'video',
            { className: 'video', controls: true, onClick: openUrl.bind(null, url), draggable: true, onDragStart: dragBookmark.bind(null, index), onDragEnd: dropBookmark},
            React.createElement('source', { src: url}, null)
        )
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {
            pageInfo: this.getPageInfo(),
            header: document.getElementById('redHeader'),
            pages: [],
            photos: [],
            videos: [],
            pageToRender: null
        };
    },
    componentWillMount: function() {
        //Change color scheme based on incognito
        if(this.state.pageInfo.isIncognito) {
            document.getElementById('mainHeader').style.backgroundColor = "#191919";
            document.getElementsByTagName('footer')[0].style.backgroundColor = "#191919";
        }

        //Allow deletion on drag over on header
        this.state.header.addEventListener('dragover', function(e) {e.preventDefault(); }, false);
        this.state.header.addEventListener('drop', this.deleteBookmark, false);

        //Populate the current page
        if(this.state.pageInfo.pageType === 'PAGES') {
            this.getPages();
        } else if(this.state.pageInfo.pageType === 'PHOTOS') {
            this.getPhotos();
        } else if(this.state.pageInfo.pageType === 'VIDEOS') {
            this.getVideos();
        }
    },
    getPageInfo: function() {
        var pageInfo = {
            currentPage: document.getElementById('container'),
            isIncognito: chrome.extension.getBackgroundPage().bookmarks.pageInfo.isIncognito
        };
        pageInfo.pageType = pageInfo.currentPage.getAttribute('data-pageType').toUpperCase();

        return pageInfo;
    },
    dragBookmark: function(index, e) {
        e.dataTransfer.setData('index', index);
        this.state.header.style.display = 'block';
    },
    dropBookmark: function() {
        this.state.header.style.display = 'none';
    },
    getBookmarks: function(bookmarkType, next) {
        chrome.storage.sync.get(bookmarkType, function(result) {
            if (chrome.runtime.lastError) {
                console.error("Unable to retrieve the bookmarks!");
                return;
            }

            var bookmarks = result[bookmarkType] || [];
            next(bookmarks);
        });
    },
    deleteBookmark: function(e) {
        var confirmDelete = window.confirm('Are you sure you want to remove this bookmark?'),
            index = e.dataTransfer.getData('index');

        if(confirmDelete) {
            if(this.state.pageInfo.pageType === 'PAGES') {
                this.deletePage(index);
            } else if(this.state.pageInfo.pageType === 'PHOTOS') {
                this.deletePhoto(index);
            } else if(this.state.pageInfo.pageType === 'VIDEOS') {
                this.deleteVideo(index);
            }
        }
    },
    openUrl: function(url) {
        chrome.runtime.sendMessage({action: 'openUrl', url: url});
    },
    getPages: function() {
        var context = this,
            pages = [];

        this.getBookmarks('Pages', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                if(!b.isIncognito || context.state.pageInfo.isIncognito) {
                    pages.push(React.createElement(
                        Page,
                        {title: b.key, url: b.value, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}
                    ));
                }
            }
            context.setState({
                pages: pages,
                pageToRender: React.createElement('div', null, pages)
            });
        });
    },
    deletePage: function(index) {
        //Remove React components
        var pages = this.state.pages;
        this.setState( {pages: pages.splice(index, 1)});

        //Remove bookmarks in storage
        this.getBookmarks('Pages', function(bookmarks) {
            bookmarks.splice(index, 1);
            chrome.storage.sync.set({'Pages': bookmarks});
        });
    },
    getPhotos: function() {
        var context = this,
            photos = [];

        this.getBookmarks('Photos', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                if(!b.isIncognito || context.state.pageInfo.isIncognito) {
                    photos.push(React.createElement(Photo, {url: b.url, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}));
                }
            }
            context.setState({
                photos: photos,
                pageToRender: React.createElement('div', null, photos)
            });
        });
    },
    deletePhoto: function(index) {
        //Remove React components
        var photos = this.state.photos;
        this.setState( {photos: photos.splice(index, 1)});

        //Remove bookmarks in storage
        this.getBookmarks('Photos', function(bookmarks) {
            bookmarks.splice(index, 1);
            chrome.storage.sync.set({'Photos': bookmarks});
        });
    },
    getVideos: function() {
        var context = this,
            videos = [];

        this.getBookmarks('Videos', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                if(!b.isIncognito || context.state.pageInfo.isIncognito) {
                    videos.push(React.createElement(Video, {url: b.url, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}));
                }
            }
            context.setState({
                videos: videos,
                pageToRender: React.createElement('div', null, videos)
            });
        });
    },
    deleteVideo: function(index) {
        console.log('Index: ' + index);
        //Remove React components
        var videos = this.state.videos;
        console.log(videos[index]);
        this.setState( {videos: videos.splice(index, 1)});

        //Remove bookmarks in storage
        this.getBookmarks('Videos', function(bookmarks) {
            bookmarks.splice(index, 1);
            chrome.storage.sync.set({'Videos': bookmarks});
        });
    },
    render: function() {
        if(this.state.pageToRender) {
            return this.state.pageToRender;
        } else {
            return React.createElement('h3', null, 'Loading page...');
        }
    }
});

React.render(React.createElement(Main), document.getElementById('container'));