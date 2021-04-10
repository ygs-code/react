'use strict';

var number = 0;
var H = function H() {
    return React.createElement(
        'div', {
            onClick: function() {
                console.log(++number);
            }
        },
        '点击事件'
    );
};
console.log('H=',H())
ReactDOM.render(React.createElement(H, null), document.getElementById('example'));