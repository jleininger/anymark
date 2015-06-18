var Main = React.createClass({
    render: function () {
        return ( 
            <h1>Hello! Im rendered from React.js!</h1>
            )
        }
});

React.render( <Main />, document.getElementById("container"));