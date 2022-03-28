     console.log('props===',props)

// 创建一个 theme Context,  默认 theme 的值为 light
const ThemeContext = React.createContext();

function Button(props){
     console.log('props===',props)
   return (
       <button>{props.theme}</button>
   )
}

function ThemedButton(props) {
  // ThemedButton 组件从 context 接收 theme
  return (
    <ThemeContext.Consumer>
      {
          theme =>{
            console.log('theme=',theme)
               console.log('props==',props)
              return      <Button {...props} theme={theme} /> 
          }


      
      }
    </ThemeContext.Consumer>
  );
}

// 中间组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

ReactDOM.render(
    <App/>,
     document.getElementById('example')
   );

