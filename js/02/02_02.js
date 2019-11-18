var WebSite = React.createClass({
    render:function(){
          return (
              <div>
                  {/*第一个组建*/}
                    <Name name={this.props.name}/>
                 {/*第二个组建 */}
                    <Link src={this.props.src}/>
              </div>
          );
    }
});


let Name = React.createClass({
    render:function(){
        return (
            <div>{this.props.name}</div>
        )
    }
});

let Link = React.createClass({
    render:function(){
        return (
            <a href={this.props.src}>百度网站</a>
        );
    }
});

ReactDOM.render(
     <WebSite name="我的名字是姚观寿1" src="www.baidu.com" />,
    document.getElementById('example')
);