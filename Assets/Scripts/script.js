var Main = React.createClass({displayName: 'Main',
    render: function () {
        return React.createElement('h1', null, "Hello! I'm Rendered from React.js!");
        }
});

React.render( React.createElement(Main), document.getElementById("container"));