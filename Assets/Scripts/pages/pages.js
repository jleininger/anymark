var Page = React.createClass({
    displayName: 'Page',
    render: function() {
        var title = this.props.title,
            url = this.props.url,
            openPage = this.props.openPage;

        return React.createElement(
            'div',
            { className: 'main-menu', onClick: openPage.bind(null, url) },
            React.createElement('h2', null, title));
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {pages: []};
    },
    openPage: function(url) {
        console.log(url);
        chrome.runtime.sendMessage({action: 'openPage', url: url});
    },
    getPages: function() {
        var context = this;
        chrome.storage.sync.get('Pages', function(result) {
            if (chrome.runtime.lastError) {
                console.error("Unable to retrieve the pages bookmarks!");
                return;
            }

            var bookmarks = result['Pages'] || [],
                pages = [];

            for(var i = 0; i < bookmarks.length; i++) {
                var b = bookmarks[i];
                pages.push(React.createElement(Page, {title: b.key, url: b.value, openPage: context.openPage}));
            }

            context.setState({pages: pages});
        });
    },
    render: function() {
        this.getPages();
        return React.createElement('div', null, this.state.pages);
    }
});

React.render(React.createElement(Main), document.getElementById('container'));