var LinkButton=React.createClass({
        getInitialState:function(){
            return {
                liked:false
            };
      },
      handClick:function(){


          this.setState({
              liked: !this.state.liked
          });

      },
    render:function(){
          var text=this.state.liked?'喜欢':'不喜欢';
        return (
             <p onClick={this.handClick}>
                 你<b>{text}</b>我。点击切换状态
             </p>
        );
    }
}
);

ReactDOM.render(
    <LinkButton />,
    document.getElementById('example')

);