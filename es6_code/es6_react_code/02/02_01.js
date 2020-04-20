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