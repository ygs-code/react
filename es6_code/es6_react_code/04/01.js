/*
 * @Author: your name
 * @Date: 2021-05-06 12:29:53
 * @LastEditTime: 2021-05-11 11:49:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react/es6_code/es6_react_code/04/04_01.js
 */
// import React, { useState, useEffect } from 'react'

const H = () => {
  return <div>你好</div>;
};
const Show = (props) => {
  const { flag } = props;
  React.useEffect(() => {
    console.log(1);

    return () => {
      console.log(2);
    };
  });

  return (
    <div>
      <H></H>
      {flag ? <div> 显示</div> : null}{" "}
    </div>
  );
};

const LazyPage = () => {
  const [name, setName] = React.useState("zhangsan");
  const [flag, setFlag] = React.useState(true);
  return (
    <div>
      <button
        onClick={  () => {
          //  setTimeout(() => {
            // new Promise((resolve, reject) => {
            //   resolve()
            // }).then(()=>{
            //   setFlag(false);
            // })
            // setFlag(true);
            // setTimeout(()=>{
            //   setFlag(false);
            // })
          //  }, 100);
        }}
      >
        按钮
      </button>
      <Show flag={flag}> </Show>
      <p> My Name is: {name} </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<LazyPage />, document.getElementById("example"));
