let UserGist=React.createClass({
    getInitalState:function(){
         return {
             username:'',
             lastGistUrl:'',
         }
    },
    componentDidMount:function(){
          this.serverRequest=$.get(this.props.source,function(result){
               var lastGist = reslt[0];
              this.setState({
                     username:lastGist.owner.login,
                     laseGistUrl:lastGist.html_url
              });
          }.bind(this));
    },
    componentWillUnmount:function(){
        this.serverRequest.abort();
    },
    render:function(){
         return(
                <div>
                    {this.state.username}用户最新的gist共享地址：
                    <a href={this.state.laseGistUrl}>{this.state.laseGistUrl}</a>
                </div>
              );
    }
});

ReactDOM.render(
    <UserGist source="https://api.github.com/users/octocat/gists"/>,
    document.getElementById('example')
);