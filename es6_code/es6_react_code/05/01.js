/*
 * @Author: your name
 * @Date: 2020-11-09 14:51:25
 * @LastEditTime: 2021-05-12 11:02:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react-hook/js/09_02-useContext.js
 */
// Context 解决了多层组件props传递数据等问题。 创建Context
const TestContext = React.createContext({
  color: "red",
});
const Navbar = () => {
  // 获取Context 的值
  const { username, color } = React.useContext(TestContext);
  const Context = React.useContext(TestContext);
  console.log("TestContext=", TestContext);
  return (
    <div className="navbar">
      <p>{username}</p>
      <p>color={color}</p>
    </div>
  );
};

Navbar.contextType = TestContext;

const Messages = () => {
  // 获取Context 的值
  // const { username, count } = React.useContext(TestContext);
  console.log("username=");

  return (
    <div className="messages">
    {/*
 
      <p>1 message for {username}</p>
      <p>1 count for {count}</p>
    */}
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
          点击加加{ this.state.count}
        </button>
        <TestContext.Provider
          value={{
            //   ...data,
            count: this.state.count,
            username: "superawesome",
          }}
        >
          <div className="test">
            <Navbar />
            <Messages />
          </div>
        </TestContext.Provider>
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
