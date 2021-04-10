<<<<<<< HEAD
// import React, { useState, useEffect } from 'react'

const Show =(props)=>{
  const {flag}=props;
  React.useEffect(() => {
     console.log(1)

    return () => {
      console.log(2)

    };
  });

  return (
    <div> {flag?(<div> 显示</div> ):null} </div>
  )

}

const LazyPage = () => {
  const [name, setName] = React.useState("zhangsan");
  const [flag, setFlag] = React.useState(true);
  return (
    <div>
      <button
        onClick={() => {
          setFlag(false);
        }}
      >
        按钮
      </button>
      <Show flag={flag}> </Show>
      <p> My Name is: {name} </p>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
    </div>
  );
};

ReactDOM.render(<LazyPage />, document.getElementById("example"));
=======
// import React, { useState, useEffect } from 'react'

const Show =(props)=>{
  const {flag}=props;
  React.useEffect(() => {
     console.log(1)

    return () => {
      console.log(2)

    };
  });

  return (
    <div> {flag?(<div> 显示</div> ):null} </div>
  )

}

const LazyPage = () => {
  const [name, setName] = React.useState("zhangsan");
  const [flag, setFlag] = React.useState(true);
  return (
    <div>
      <button
        onClick={() => {
          setFlag(false);
        }}
      >
        按钮
      </button>
      <Show flag={flag}> </Show>
      <p> My Name is: {name} </p>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
    </div>
  );
};

ReactDOM.render(<LazyPage />, document.getElementById("example"));
>>>>>>> 46e5d654750168326619cd5ec4cf48a1c0506d86
