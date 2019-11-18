let HelloMessage=React.createClass({
    getInitialState:function(){
         return {
            value:'Hello Runoob!'
         }
    },
    handleChange:function(event){
         this.setState({
             value:event.target.value
         });
    },
    render:function(){
        return <div>
              <input type="text"  value={this.state.value} onChange={this.handleChange} />
           <h4>{this.state.value}</h4>
        </div>
    }

})

ReactDOM.render(
    <HelloMessage/>,
    document.getElementById('example')
);