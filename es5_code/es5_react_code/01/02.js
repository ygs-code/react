/*
 * @Author: your name
 * @Date: 2021-04-10 18:51:19
 * @LastEditTime: 2021-04-10 18:51:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react源码分析/es5_code/es5_react_code/01/02.js
 */
'use strict';

var H = function H() {
    return React.createElement(
        'h1',
        null,
        'Hello, world'
    );
};
ReactDOM.render(React.createElement(H, null), document.getElementById('example'));
