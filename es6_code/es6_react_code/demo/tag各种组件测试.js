/*
 * @Author: your name
 * @Date: 2021-05-14 11:23:59
 * @LastEditTime: 2021-05-14 12:06:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react/es6_code/es6_react_code/demo/tag各种组件测试.js
 */
const {
  Component,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} = React;

class ClassComponent extends Component {
  render() {
    return <div name="ClassComponent组件">ClassComponent组件</div>;
  }
}

// memo
const MemoComponent = memo((props) => (
  <div name="MemoComponent组件">MemoComponent组件</div>
));

const UseMemoComponent = () => {
  const [count, setCount] = useState(1);

  const expensive = useMemo(() => {
    return count;
  }, [count]);
  // 返回函数

  return <div name="UseMemoComponent组件">expensive={expensive}</div>;
};

//forwardRef
const ForwardRefComponent = forwardRef((props, ref) => (
  <div name="ForwardRefComponent组件">ForwardRefComponent组件</div>
));

//HocComponent
class HocComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 获取初始化值
      value: props.initialValue,
    };
  }
  onChange(e) {
    //  事件改变值回调
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  }
  render() {
    return (
      <div>
        {/* 这样children 可以传递参数啦 */}
        {this.props.children({
          value: this.state.value,
          onChange: this.onChange.bind(this),
        })}
      </div>
    );
  }
}

const App = (props) => {
  return (
    <div>
      <ClassComponent key="0"></ClassComponent>
      <MemoComponent key="1" />
      <UseMemoComponent key="2" />
      <ForwardRefComponent key="3" />

      <HocComponent
        key="4"
        name="HocComponent"
        initialValue="init"
        onChange={(val) => {
          console.log("HocBind", val);
        }}
      >
        {
          //  这是一个函数接受props
          (parentProps) => (
            <div>
              <p> Render Props HocBind实现 value:{parentProps.value}</p>
              <input placeholder="input" {...parentProps} />
            </div>
          )
        }
      </HocComponent>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("example"));
