'use strict';

var style = {
    width: '100px',
    height: '200px',
    color: 'red'
};
var H = function H() {
    return React.createElement(
        'div', {
            style: style
        },
        'Hello, world'
    );
};
ReactDOM.render(React.createElement(H, null), document.getElementById('example'));