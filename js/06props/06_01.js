var HelloMessage=React.createClass({
     render:function(){
         console.log(this.props)
           return <h1>Hello {this.props.name}</h1>
     }
});

ReactDOM.render(
    <HelloMessage  name="Runoob"  hage="cc"/>,
    document.getElementById('example')
);