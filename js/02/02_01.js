//组建必须是大写开头的 不然会渲染不出来
//创建一个组建
// var HelloMessage=React.createClass({
//      render:function(){
//          return <h1>你好react {this.props.name}</h1>
//      }
// });
 //创建一个组建
 function HelloMessage(props) {
       return <h1>Hello World123!</h1>;
 }

//渲染组建
ReactDOM.render(
    <HelloMessage name="this is a react" />,
    document.getElementById('example')
);

