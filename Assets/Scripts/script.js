var Page = React.createClass({
    displayName: 'Page',
    render: function() {
        var title = this.props.title,
            url = this.props.url,
            openUrl = this.props.openUrl,
            dragBookmark = this.props.dragBookmark;

        return React.createElement(
            'div',
            { className: 'main-menu', onClick: openUrl.bind(null, url), draggable: true, onDragStart: dragBookmark },
            React.createElement('h2', null, title));
    }
});

var Photo = React.createClass({
    displayName: 'Photo',
    render: function() {
        var url = this.props.url,
            openUrl = this.props.openUrl;

        return React.createElement('img', {className: 'photo', src: url, onClick: openUrl.bind(null, url)}, null);
    }
});

var Video = React.createClass({
    displayName: 'Video',
    render: function() {
        var url = this.props.url,
            openUrl = this.props.openUrl;
        return React.createElement(
            'video',
            { className: 'video', controls: true, onClick: openUrl.bind(null, url)},
            React.createElement('source', { src: url}, null)
        )
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {
            pageType: this.getPageType(),
            header: document.getElementById('header'),
            pages: [],
            photos: [],
            videos: [],
            pageToRender: null
        };
    },
    componentWillMount: function() {
        //Allow deletion on drag over on header
        //this.state.header.addEventListener('dragover', this.dropBookmark, false);

        //Populate the current page
        if(this.state.pageType === 'PAGES') {
            this.getPages();
        } else if(this.state.pageType === 'PHOTOS') {
            this.getPhotos();
        } else if(this.state.pageType === 'VIDEOS') {
            this.getVideos();
        }
    },
    getPageType: function() {
        var currentPage = document.getElementById('container'),
            pageType = currentPage.getAttribute('data-pageType');

        return pageType.toUpperCase();
    },
    dragBookmark: function() {
        this.state.header.className = 'red-header';
    },
    dropBookmark: function() {
        this.state.header.className = '';
    },
    openUrl: function(url) {
        chrome.runtime.sendMessage({action: 'openUrl', url: url});
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
    getPages: function() {
        var context = this,
            pages = [];

        this.getBookmarks('Pages', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                pages.push(React.createElement(Page, {title: b.key, url: b.value, openUrl: context.openUrl, dragBookmark: context.dragBookmark}));
            }
            context.setState({
                pages: pages,
                pageToRender: React.createElement('div', null, pages)
            });
        });
    },
    getPhotos: function() {
        var context = this,
            photos = [];

        this.getBookmarks('Photos', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                photos.push(React.createElement(Photo, {url: b, openUrl: context.openUrl}));
            }
            context.setState({
                photos: photos,
                pageToRender: React.createElement('div', null, photos)
            });
        });
    },
    getVideos: function() {
        var context = this,
            videos = [];

        this.getBookmarks('Videos', function(bookmarks) {
            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                videos.push(React.createElement(Video, {url: b, openUrl: context.openUrl}));
            }
            context.setState({
                videos: videos,
                pageToRender: React.createElement('div', null, videos)
            });
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