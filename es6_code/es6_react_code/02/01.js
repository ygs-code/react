/*
 * @Author: your name
 * @Date: 2021-05-06 12:29:53
 * @LastEditTime: 2021-05-07 10:12:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /react/es6_code/es6_react_code/02/01.js
 */
var number=0;
const H=()=>(
    <div onClick={()=>{
        console.log(++number)
    }}> 
       点击事件  
    </div>
   );
 ReactDOM.render(
    <H/>,
     document.getElementById('example')
   );