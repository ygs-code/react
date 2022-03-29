/*
 * @Author: your name
 * @Date: 2021-05-14 16:30:43
 * @LastEditTime: 2021-05-14 16:31:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /react/es6_code/es6_react_code/demo/classConpoment.js
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      value: "",
    };
  }
  componentDidMount() {}

  componentDidUpdate() {}
  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  }
  render() {
    return (
      <div>
        <button
          onClick={() => {
            // setCount(count+1)
            this.setState({
              count: this.state.count + 1,
            });
          }}
        >
          点击加加{this.state.count}
        </button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("example"));
