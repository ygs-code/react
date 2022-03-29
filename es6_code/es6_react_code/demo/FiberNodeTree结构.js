const { useState } = React;

const Label = (props) => {
  const { label } = props;
  return <span>{label}</span>;
};

const Input = (props) => {
  const [value, setValue] = useState("初始值");

  return (
    <div>
      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      ></input>
      value= {value}
    </div>
  );
};

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "box",
    };
  }
  componentDidMount() {}

  componentDidUpdate() {}
  render() {
    return <div>这是一个盒子 {this.state.name}</div>;
  }
}

class StaticBox extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentDidUpdate() {}
  render() {
    return <div>StaticBox</div>;
  }
}

class PropsBox extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentDidUpdate() {}
  render() {
    return <div>PropsBox={this.props.name}</div>;
  }
}

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
      <div name="diev1">
        <div name="diev2">
          <div name="diev3">
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
            <input onChange={this.onChange.bind(this)}></input>
            value={this.state.value}
          </div>
        </div>
        <Box></Box>
        <Label label="hello"></Label>
        <Input></Input>
        <PropsBox name={'PropsBox'}></PropsBox>
        <StaticBox></StaticBox>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("example"));
