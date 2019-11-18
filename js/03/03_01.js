var  LikeButton=React.createClass({
     getInitialState:function() {  //设置state 属性
               return {
                   liked:false
               };
     },
     handleClick:function () {
         this.setState({
                liked:!this.state.liked
             });
     },
    render:function() {
        var text=this.state.liked?'喜欢':'不喜欢';
        return (
            <p onClick={this.handleClick}>
               你<b>{text}</b>我，点击切换状态
            </p>

        );
    }
});

ReactDOM.render(
    <LikeButton />,
    document.getElementById('example')
);
