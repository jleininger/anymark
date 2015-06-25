var Page = React.createClass({
    displayName: 'Page',
    render: function() {
        var title = this.props.title,
            url = this.props.url,
            openUrl = this.props.openUrl;

        return React.createElement(
            'div',
            { className: 'main-menu', onClick: openUrl.bind(null, url) },
            React.createElement('h2', null, title));
    }
});

var Photo = React.createClass({
    displayName: 'Photo',
    render: function() {
        return React.createElement('h2', null, 'Hi');
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {
            pageType: this.getPageType(),
            pages: [],
            photos: []
        };
    },
    componentWillMount: function() {
        if(this.state.pageType === 'PAGES') {
            this.getPages();
        }
    },
    getPageType: function() {
        var currentPage = document.getElementById('container'),
            pageType = currentPage.getAttribute('data-pageType');

        return pageType.toUpperCase();
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
                pages.push(React.createElement(Page, {title: b.key, url: b.value, openUrl: context.openUrl}));
            }

            context.setState({pages: pages});
        });
    },
    render: function() {
        var pageToRender = React.createElement('h2', null, 'Sorry, this page is currently unavailable.');

        if(this.state.pageType === "PAGES") {
            pageToRender = React.createElement('div', null, this.state.pages);
        } else if (this.state.pageType === "PHOTOS") {
            //Add photos here
        }

        return pageToRender;
    }
});

React.render(React.createElement(Main), document.getElementById('container'));