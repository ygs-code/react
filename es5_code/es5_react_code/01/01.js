'use strict';

    
var element = React.createElement(
    'h1',
    null,
    'Hello, world'
)

console.log('element==',element)
ReactDOM.render(React.createElement(
    'h1',
    null,
    'Hello, world'
), document.getElementById('example'));