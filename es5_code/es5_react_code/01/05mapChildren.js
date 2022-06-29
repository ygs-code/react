/*
 * @Date: 2022-05-30 21:22:17
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-30 22:29:34
 * @FilePath: /react/es5_code/es5_react_code/01/05mapChildren.js
 * @Description:
 */

'use strict';

var _React = React;
var Children = _React.Children;

var HighOrderComponent = function HighOrderComponent(props) {
    var children = props.children;

    return React.createElement('div', null, React.createElement('div', null, '我是父组件'), React.createElement('div', null, Children.map(children, function(child) {
        console.log('child=============', child);

        return React.createElement('div', null, child);
    })), 'Ï');
};
var Child = function Child() {
    return React.createElement('div', null, '我是子组件');
};
ReactDOM.render(React.createElement(HighOrderComponent, null, React.createElement(Child, null), React.createElement(Child, null), React.createElement(Child, null), React.createElement(Child, null), React.createElement(Child, null)), document.getElementById('example'));