/*
 * @Author: your name
 * @Date: 2021-05-14 16:30:43
 * @LastEditTime: 2021-05-17 12:27:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react/es6_code/es6_react_code/demo/classConpoment.js
 */
const { useState } = React;
const Box =(props)=>{
  return (<div > 这是一个{props.name}盒子</div>)
}
const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        点击加加{count}
      </button>
      <Box name="box"></Box>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("example"));
