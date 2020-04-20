'use strict';

var H = function H() {
    return React.createElement(
        'h1',
        null,
        'Hello, world'
    );
};
ReactDOM.render(React.createElement(H, null), document.getElementById('example'));