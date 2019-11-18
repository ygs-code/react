var MyComponent = React.createClass({
    handleClick: function() {
        // 使用原生的 DOM API 获取焦点
        this.refs.myInput.focus();
    },
    render: function() {
        //  当组件插入到 DOM 后，ref 属性添加一个组件的引用于到 this.refs
        return (
            <div>
                <input type="text" ref="myInput" />
                <input
                    type="button"
                    value="点我输入框获取焦点"
                    onClick={this.handleClick}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <MyComponent />,
    document.getElementById('example')
);