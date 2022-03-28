<<<<<<< HEAD
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
=======
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
>>>>>>> 46e5d654750168326619cd5ec4cf48a1c0506d86
   );