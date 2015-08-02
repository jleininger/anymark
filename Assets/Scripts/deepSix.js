var DeletableItem = React.createClass({
    displayName: 'DeletableItem',
    render: function() {
        var itemClass = (this.props.checked) ? 'deep-six-item-checked' : 'deep-six-item';
        return React.createElement('div', {className: itemClass, onClick: this.props.toggleItem.bind(null, this.props.itemType)}, React.createElement('h3', null, this.props.itemType));
    }
});

var ConfirmButton = React.createClass({
    displayName: 'ConfirmButton',
    render: function() {
        return React.createElement('div', { className: 'main-button main-button-red', onClick: this.props.confirmDelete}, 'Confirm');
    }
});

var Main = React.createClass({
    displayName: 'Main',
    getInitialState: function() {
        return {
            pagesChecked: false,
            photosChecked: false,
            videosChecked: false
        };
    },
    toggleItem: function(itemType) {
        switch(itemType) {
            case 'Pages':
                this.setState({ pagesChecked: !this.state.pagesChecked });
                break;
            case 'Photos':
                this.setState({ photosChecked: !this.state.photosChecked });
                break;
            case 'Videos':
                this.setState({ videosChecked: !this.state.videosChecked });
                break;
        }
    },
    confirmDelete: function() {
        if(window.confirm('Are you sure you want to do this?')) {
            if(this.state.pagesChecked) {
                chrome.storage.sync.set({'Pages': []});
            }
            if(this.state.photosChecked) {
                chrome.storage.sync.set({'Photos': []});
            }
            if(this.state.videosChecked) {
                chrome.storage.sync.set({'Videos': []});
            }
            this.setState({
                pagesChecked: false,
                photosChecked: false,
                videosChecked: false
            });
            window.alert('Selected bookmarks deleted');
        }
    },
    render: function() {
        return React.createElement('div', null, [
            React.createElement(DeletableItem, { itemType: 'Pages', checked: this.state.pagesChecked, toggleItem: this.toggleItem }),
            React.createElement(DeletableItem, { itemType: 'Photos', checked: this.state.photosChecked, toggleItem: this.toggleItem }),
            React.createElement(DeletableItem, { itemType: 'Videos', checked: this.state.videosChecked, toggleItem: this.toggleItem }),
            React.createElement(ConfirmButton, { confirmDelete: this.confirmDelete }, null)
        ]);
    }
});

React.render(React.createElement(Main), document.getElementById('container'));