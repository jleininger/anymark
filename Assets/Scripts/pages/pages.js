var Page = React.createClass({
    displayName: 'Page',
    render: function() {
        var title = this.props.title,
            url = this.props.url,
            titleElement = React.createElement('h2', null, title),
            menuElement = React.createElement('div', { className: 'main-menu' }, titleElement);


        return menuElement;
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {pages: []};
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
                pages.push(React.createElement(Page, {title: b.key, url: b.value}));
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