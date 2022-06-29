/*
 * @Date: 2022-05-30 21:22:17
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-30 21:44:25
 * @FilePath: /react/es6_code/es6_react_code/01/05mapChildren.js
 * @Description:
 */

const { Children } = React

console.log('React=',React)
console.log('Children=',Children)
debugger;
const HighOrderComponent = (props) => {
  const { children } = props
  return (
    <div>
      <div>我是父组件</div>
      <div>
        {Children.map(children, (child) => {
          return <div>{child}</div>
        })}
      </div>
      Ï
    </div>
  )
}
const Child = () => {
  return <div>我是子组件</div>
}
ReactDOM.render(
  <HighOrderComponent>
    <Child />
    <Child />
    <Child />
    <Child />
    <Child />
  </HighOrderComponent>,
  document.getElementById('example'),
)
