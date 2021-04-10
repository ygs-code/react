const {useState}=React;
const H = () => {
  const [arr,setArr]=useState(arr)
  // const arr = [1, 2, 4];
  return <h1 arr={[1, 2, 4]} onClick={()=>console.log(1)} >Hello, world</h1>;
};
const a={
  name:1
}
console.log({
  ...a,
})
ReactDOM.render(<H />, document.getElementById("example"));
