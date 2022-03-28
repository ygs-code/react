
const style={
  width:'100px',
  height:'200px',
  color:'red',
}
const H=()=>(
<div
 style={style}
>Hello, world
</div>);
 ReactDOM.render(
   <H/>,
    document.getElementById('example')
  );