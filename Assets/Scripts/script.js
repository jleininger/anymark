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
            pageType: this.getPageType(),
            header: document.getElementById('redHeader'),
            pages: [],
            photos: [],
            videos: [],
            pageToRender: null
        };
    },
    componentWillMount: function() {
        //Allow deletion on drag over on header
        this.state.header.addEventListener('dragover', function(e) {e.preventDefault(); }, false);
        this.state.header.addEventListener('drop', this.deleteBookmark, false);

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
            if(this.state.pageType === 'PAGES') {
                this.deletePage(index);
            } else if(this.state.pageType === 'PHOTOS') {
                this.deletePhoto(index);
            } else if(this.state.pageType === 'VIDEOS') {
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
                pages.push(React.createElement(
                    Page,
                    {title: b.key, url: b.value, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}
                ));
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
                photos.push(React.createElement(Photo, {url: b, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}));
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
        this.setState( {pages: photos.splice(index, 1)});

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
                videos.push(React.createElement(Video, {url: b, index: i, openUrl: context.openUrl, dragBookmark: context.dragBookmark, dropBookmark: context.dropBookmark}));
            }
            context.setState({
                videos: videos,
                pageToRender: React.createElement('div', null, videos)
            });
        });
    },
    deleteVideo: function(index) {
        //Remove React components
        var videos = this.state.videos;
        this.setState( {pages: videos.splice(index, 1)});

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