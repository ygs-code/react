/*
 * @Author: your name
 * @Date: 2020-11-09 14:51:25
 * @LastEditTime: 2021-05-12 20:12:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-hook/js/09_02-useContext.js
 */
// Context 解决了多层组件props传递数据等问题。 创建Context

const C0 = (props) => {
  console.log('props=',props)
 const  {count} =props
  return <div>0 count={count}</div>;
};
const C1 = (props) => {
  return (
    <div>
    1
      <C0 {...props}></C0>
    </div>
  );
};
const C2 = (props) => {
  return (
    <div>
    2
      <C1 {...props}></C1>
    </div>
  );
};
const C3 = (props) => {
  return (
    <div>
    3
      <C2 {...props}></C2>
    </div>
  );
};
const C4 = (props) => {
  return (
    <div>
    3
      <C3 {...props}></C3>
    </div>
  );
};
const C5 = (props) => {
  return (
    <div>
    4
      <C4 {...props}></C4>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    var flag = true;
    setTimeout(() => {
      flag = false;
    }, 3000);
    // for (let i = 0; i < 1000000000; i++) {}
  }

  componentDidUpdate() {
    // console.log("performance.getEntries()1:",performance.getEntries());
    // for (let i = 0; i < 10000100000; i++) {}
    // setTimeout(()=>{
    //   console.log("performance.getEntries()2:",performance.getEntries());
    // },500)
    // // debugger
    // this.setState({
    //   count: this.state.count + 1,
    // });
    // return true
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
        <C5 {...this.state}></C5>
      </div>
    );
  }
}

// function App() {
//   const data = {};
//   const [count, setCount] = React.useState(0);

//   return (
//     <div >
//     <button onClick={()=>{
//         setCount(count+1)
//     }}>点击加加</button>
//       <TestContext.Provider
//         value={{
//           ...data,
//           count,
//           username: "superawesome",
//         }}
//       >
//         <div className="test">
//           <Navbar />
//           <Messages />
//         </div>
//       </TestContext.Provider>
//     </div>
//   );
// }

const Root = () => {
  return (
    <div>
      <App />
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById("example"));
