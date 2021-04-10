* react逐行源码分析，详细介绍了react源码内部的每一个细节，可以细致到每一个函数，每一句代码执行。

* react总共3w多行代码。如果打算看下去，那么你要坚持下去，毕竟这么庞大代码不是一两天就能看懂的。当然一点点的看，其实他并不难，难得是需要时间。所以要对自己树立起信心和意志。至于看多久不太清楚毕竟每个人基础都不一样，但是这篇文章可以让你很轻松的读解react内部的源码。
* 那么接下来我们就一起开始学习吧。

# babel知识

## babel与react的关系

* Babel 是一个 JavaScript 编译器,它能将es2015,react等低端浏览器无法识别的语言，进行编译。

* react使用的语法是jsx，但是在浏览器中是不认识jsx语法的。浏览器只认识，html，js和css。其实我们写的react代码，是经过了babel转换之后，在去调用react底层源码的方法，并是不我们现在执行的方法。

* 举个很简单的例子

  * 下面是我们写一个react代码很简单的例子 hello

    ```
    const Hello=()=>{
        return (<h1>Hello, world!</h1>)
    }
    ReactDOM.render(
        <Hello />,
        document.getElementById('example')
      );
    ```

  * 其实在浏览器中不是执行这样的代码，在react中也不是直接执行这样的代码。而是经过了babel的转换转成这样子的代码

    ```
    var Hello = function Hello() {
        return React.createElement(
            'h1',
            null,
            'Hello, world!'
        );
    };
    ReactDOM.render(React.createElement(Hello, null), document.getElementById('example'));
    ```

    上面才是真正react执行的代码，只有这样的代码，然后结合我们源码去读解才能理解react源码的核心，所以接下来下面有些知识我们会提到babel的源码，当然只是提到一部分，babel源码太多，看完的话需要很多时间。我们需要看关联的就可以了。

## babel源码粗略分析

### babel框架源码构架分析

* 接下来我们先看看babel整个框架设计思路

* bebel源码其实里面是分模块写的每个模块存在在 对象t中并且用数字对位key值，传入对应的key的时候就可以引用到该模块，然后该对象值是一个数组，第数组就是要执行该模块的代码，然后第二个参数就是该模块的代码需要依赖哪些其他模块的索引。然后我们把这个t模块打印出来看看。

* ```
    return (function e(t,n,r){
                      console.log('t=',t)
                      console.log('n=',n)
                      console.log('r=',r)
                       // 执行模块化代码 如果执行过则将添加到o缓存中
                        function s(o,u){
                          console.log('o=',o)
                          console.log('a=',a)
                          console.log('i=',i)
                          console.log('u=',u)
                              if(!n[o]){
                                if(!t[o]){ // 如果传入的索引 在t模块中没有则判断a和i是否是函数如果不是则会报错
                                        var a=typeof require=="function"&&require;
                                        if(!u&&a) {
                                          return a(o,!0);
                                        }
                                        if(i){
                                          return i(o,!0);
                                        }
                                        var f=new Error("Cannot find module '"+o+"'");
                                        throw f.code="MODULE_NOT_FOUND",f
                                      }
                                var l=n[o]={ //执行过的模块记录在n对象中
                                    exports:{}
                                  };
                                // 执行模块中的代码 
                                t[o][0].call(
                                  l.exports,
                                  //给作为进去模块中还可以回调再调用其他模块相当于有链式调用的作用
                                  function(e){ // e 索引 调用模块中的索引
      
                                      var n=t[o][1][e];
                                      //数字
                                      console.log('n=',n)
                                      debugger;
                                      return s(n?n:e)
                                 },
                                 l,
                                 l.exports,
                                 e,
                                 t,
                                 n,
                                 r
                                )
                              }
                                return n[o].exports
                        }
                        var i=typeof require=="function"&&require;
                        console.log('r==',r)
                        for(var o=0;o<r.length;o++){
                          s(r[o]);
                          console.log('s(r[o])')
                        }
    ```


* 我们看看日志. 我们看到他是和我们刚才说的一样

* ![01](.\01.png)

### babel是如何引用个个模块的方法呢

* 我们先看看整体的代码执行顺序,我们把代码收起来，看到这个是一个框架很常用的amd，cmd和window 环境的判断，这里用了闭包把一个函数传递进去。

![02](.\02.png)

然后我们在把目录的function 展开 看看。

![03](.\03.png)

这里我们可以看到连续使用了三层闭包，一看是先执行最外层闭包

```
return (return (function e(t, n, r) {      

})( 

{  

 t 对象

},
{},
[14] // 14 就是开始执行的模块	
)
```


然后在执行外层闭包

```
return (return (function e(t, n, r) {      

 // 这里的函数会返回一个函数
  //return fn
})( 

{  

 t 对象

},
{},
[14] // 14 就是开始执行的模块	
)(14)
```





接下来我们就看看e函数中的代码是什么

```
function e(t, n, r) {
           console.log('t=', t)
           console.log('n=', n)
          console.log('r=', r)
          debugger
          // 执行模块化代码 如果执行过则将添加到o缓存中
          function s(o, u) {
            console.log('o=', o)
            console.log('a=', a)
            console.log('i=', i)
            console.log('u=', u)
            if (!n[o]) {
              if (!t[o]) { // 如果传入的索引 在t模块中没有则判断a和i是否是函数如果不是则会报错
                var a = typeof require == "function" && require;
                if (!u && a) {
                  return a(o, !0);
                }
                if (i) {
                  return i(o, !0);
                }
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
              }
              var l = n[o] = { //执行过的模块记录在n对象中
                exports: {}
              };
              // 执行模块中的代码 
              t[o][0].call(
                l.exports,
                //给作为进去模块中还可以回调再调用其他模块相当于有链式调用的作用
                function (e) { // e 索引 调用模块中的索引
                  var n = t[o][1][e];
                  //数字
                  console.log('n=', n)
                  debugger;
                  return s(n ? n : e)
                },
                l,
                l.exports,
                e,
                t,
                n, //执行过的模块
                r
              )
            }
            return n[o].exports
          }
          var i = typeof require == "function" && require;
          console.log('r==', r)
          for (var o = 0; o < r.length; o++) {
            s(r[o]);
            console.log('s(r[o])')
            debugger
          }
          return s
        }
```



* 首先我们看看e接受到的三个参数是什么

  * 第一个t就是babel 中的函数功能模块
  * n 就是用来记录那些模块功能已经执行过了
  * r数组用来执行t模块中的函数

* 然后我们看s函数

  * s函数接受o参数 其实就是t模块中的索引，用来执行t模块中的函数

  * 参数u我看日志是一个空的东西

  * 然后们看看这个函数的功能

    *  if (!n[o]) { 这里判断如果n中如果有这个值那么就不会执行下面代码了，这里的意思就是不会再去执行babel模块中的函数功能。

    * 接下来我们看看最关键的代码这里会调用t中的模块功能函数

    * ```
        // 执行模块中的代码 
                    t[o][0].call(
                      l.exports,
                      //给作为进去模块中还可以回调再调用其他模块相当于有链式调用的作用
                      function (e) { // e 索引 调用模块中的索引
                        var n = t[o][1][e];
                        //数字
                        console.log('n=', n)
                        debugger;
                        return s(n ? n : e)
                      },
                      l,
                      l.exports,
                      e,
                      t,
                      n, //执行过的模块
                      r
                    )
        ```




​     上面代码获取到索引o之后然后调取对象t模块中的方法。

  * 然后调用s方法, 所以第一次执行模块为14  r参数值为 [14]



```
    for (var o = 0; o < r.length; o++) {
                s(r[o]);
                console.log('s(r[o])')
                debugger
              }
        return s       
```

  * 后面再返回s 这样可以在外面函数再次调用s 这里再次把14传递进去。这里我不知道为什么要这样做，我把后面14注释掉程序没有报错。

    ```
    return (return (function e(t, n, r) {      
     
     // 这里的函数会返回一个函数
      //return fn
    })( 
    
    {  
    
     t 对象
    
    },
    {},
    [14] // 14 就是开始执行的模块	
    )(14)  然后我们看到他再次把14 传递进去
    ```


### babel执行es6，jsx，react源码原理

### Babel运行原理

Babel 的三个主要处理步骤分别是：

转换（transform）下载， 解析（parse）ast，生成（generate）代码。

 

### babel 代码执行转义过程以及相应代码解说

#### transform下载代码以及调用连接ast模块

* babel 开始执行代码是14模块中的 runScripts

   ```
   if (global.addEventListener) {
                    global.addEventListener("DOMContentLoaded", runScripts, false);
                  } else if (global.attachEvent) {
                    global.attachEvent("onload", runScripts);
                  }
   ```

  然后我们看看runScripts函数, 如果含有该类型的js 就加载,然后去远程请求ajax js，请求到之后就运行

  ```
      var runScripts = function runScripts() {
  
                    var scripts = [];
                    // 如果含有该类型的js 就加载
                    var types = ["text/ecmascript-6", "text/6to5", "text/babel", "module"];
                    var index = 0;
  
                    /**
                     * Transform and execute script. Ensures correct load order.
                     */
  
                    var exec = function exec() {
                      var param = scripts[index];
                      if (param instanceof Array) {
                        transform.run.apply(transform, param);
                        index++;
                        exec();
                      }
                    };
  
                    /**
                     * Load, transform, and execute all scripts.
                     */
  
                    var run = function run(script, i) {
                      var opts = {};
                      if (script.src) {
                        // 远程下载js
                        transform.load(script.src, function (param) {
                          scripts[i] = param;
                          exec();
                        }, opts, true);
                      } else {
                        opts.filename = "embedded";
                        scripts[i] = [script.innerHTML, opts];
                      }
                    };
  
                    // Collect scripts with Babel `types`.
                    // 获取 浏览器的 script 脚本
                    var _scripts = global.document.getElementsByTagName("script");
  
                    for (var i = 0; i < _scripts.length; ++i) {
                      var _script = _scripts[i];
                      if (types.indexOf(_script.type) >= 0) scripts.push(_script);
                    }
  
                    for (i in scripts) {
                      run(scripts[i], i);
                    }
  
                    exec();
                  };
  
  ```

  然后我们执行transform.load，我们看看他是怎么样的

  ```
       // 下载 js 远程请求Javascript
                  transform.load = function (url, callback, opts, hold) {
                    if (opts === undefined) opts = {};
  
                    opts.filename = opts.filename || url;
  
                    var xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();
                    xhr.open("GET", url, true);
                    if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain");
  
                    /**
                     * When successfully loaded, transform (optional), and call `callback`.
                     */
  
                    xhr.onreadystatechange = function () {
                      if (xhr.readyState !== 4) return;
  
                      var status = xhr.status;
                      if (status === 0 || status === 200) {
                        var param = [xhr.responseText, opts];
                        if (!hold) transform.run.apply(transform, param);
                        if (callback) callback(param);
                      } else {
                        throw new Error("Could not load " + url);
                      }
                    };
  
                    xhr.send(null);
                  };
  ```

   远程请求完之后就调用exec函数执行transform.run

  ```
    /**
                     * Transform and execute script. Ensures correct load order. 转换和执行脚本。确保正确的装载顺序。
                     */
  
                    var exec = function exec() {
                      var param = scripts[index];
                      if (param instanceof Array) {
                        transform.run.apply(transform, param);
                        index++;
                        exec();
                      }
                    };
  
  ```

#### es6，jsx转换ast抽象树

* 然后transform是引用66 模块

  * 执行transform.run把代码转ast成抽象树

    ![05](.\05.png)

  * 然后最外层是file，里面每个代码都会生成一个token

* 66 模块中的 transform是来自80模块的Pipeline

  * 80模块Pipeline.prototype.transform 会调用

  * 66模块中的Pipeline构造函数中的方法 Pipeline.prototype.transform又引用了File类的file.wrap和file.addCode和file.parseCode和file.transform这几个函数

  * file又引用了46模块中的File有几个关键的函数

    * File.prototype.wrap  //执行
    * File.prototype.addCode //添加code 到file对象中
    * File.prototype.parseCode // 调用File.prototype.parse  转移把code 转移成ast对象

    * File.prototype.parse //引用转移ast 模块 42模块

    * File.prototype.transform // 调用File.prototype.generate 

    * File.prototype.generate // 这个是将ast 代码转换成 es5 

  * File.prototype.parse 调用42模块，42模块的babylon.parse(code, parseOpts);模块引用612模块

    * ```
      //input 就是code
      function parse(input, options) {
                    return new _parser2["default"](options, input).parse();
                  }
      ```

  * 620模块方法继承到616原型链模块去

    * 该功能是根据的token类型，意思就是根据不同的js代码解析编译成对应的es5代码

      ![04](.\04.png)

  * 626模块方法继承到616原型链模块去

    * Tokenizer类 管理tokens把netx方法token添加到tokens队列中

    * 实例化对象把state类管理到state属性去

    * 627 State模块属性tokens 用来存储每一份代码文件的tokens代码标识 

      * 和token的属性位置信息等

      ```
          var State = (function () {
                    function State() {
                      _classCallCheck(this, State);
                    }
      
                    State.prototype.init = function init(input) {
                      this.input = input;
      
                      // Used to signify the start of a potential arrow function
                      //用于表示潜在箭头函数的开始
                      this.potentialArrowAt = -1;
      
                      // Flags to track whether we are in a function, a generator.
                      //标记来跟踪我们是否在一个函数、一个生成器中。
                      this.inFunction = this.inGenerator = false;
      
                      // Labels in scope.
                      //标签的范围。
                      this.labels = [];
      
                      // Leading decorators.
                      //领先的修饰符。
                      this.decorators = [];
      
                      // Token store. 用于记录代码Token
                      this.tokens = [];
      
                      // Comment store.
                      this.comments = [];
      
                      // Comment attachment store
                      this.trailingComments = [];
                      this.leadingComments = [];
                      this.commentStack = [];
      
                      // The current position of the tokenizer in the input.
                      //记号赋予器在输入中的当前位置。
                      this.pos = this.lineStart = 0;
                      this.curLine = 1;
      
                      // Properties of the current token:
                      // Its type
                      // 当前token的属性: 它的类型
                      this.type = _types.types.eof;
                      // For tokens that include more information than their type, the value
                      //对于包含比其类型更多信息的tokens，值
                      this.value = null;
                      // Its start and end offset 它的开始和结束偏移量
                      this.start = this.end = this.pos;
                      // And, if locations are used, the {line, column} object 如果使用了location，则使用{line, column}对象
                      // corresponding to those offsets 对应于那些偏移量
                      this.startLoc = this.endLoc = this.curPosition();
      
                      // Position information for the previous token 前一个token的位置信息
                      this.lastTokEndLoc = this.lastTokStartLoc = null;
                      this.lastTokStart = this.lastTokEnd = this.pos;
      
                      // The context stack is used to superficially track syntactic
                      // context to predict whether a regular expression is allowed in a
                      // given position.
                      // 上下文堆栈用于表面跟踪语法
                      // 上下文来预测是否允许正则表达式
                      // 给定的位置。
                      this.context = [_context.types.b_stat];
                      this.exprAllowed = true;
      
                      // Used to signal to callers of `readWord1` whether the word
                      // contained any escape sequences. This is needed because words with
                      // escape sequences must not be interpreted as keywords.
                      // 用于向“readWord1”的呼叫者发出信号，判断该词是否存在
                      // 包含任何转义序列。这是需要的，因为文字与
                      // 转义序列不能解释为关键字。
      
                      this.containsEsc = false;
      
                      return this;
                    };
      
                    State.prototype.curPosition = function curPosition() {
                      return new _utilLocation.Position(this.curLine, this.pos - this.lineStart);
                    };
                    
                      
                    State.prototype.clone = function clone() {
                      var state = new State();
                      for (var key in this) {
                        var val = this[key];
                        if (Array.isArray(val)) val = val.slice();
                        state[key] = val;
                      }
                      return state;
                    };
      
                    return State;
                  })();
      ```

  * 619模块方法继承到616原型链模块去

  * 612模块引用616模块Parser 用来转移ast对象的

    * Parser 构造函数中有一处是根据文件类型添加哪样类型的bable插件编译代码

      ```
       // 加载插件
      this.loadPlugins(this.options.plugins);
      ```

    *  Parser.prototype.parse  解析搜集ast对象
    *  628 TokenType 定义 TokenType的基本类规范，根据名称可以获取属性的Token 对象，每一个代码都会有一个Token

* ast模块大概总体链接起来是：

  * 给一个代码都会生成一个token，包括if var () class 等js的语句 token返回把他添加到state.tokens队列中。
  * ++this.state.pos 作为code的指针索引
  * nextToken 方法是控制下一个token生成
  * Tokenizer.prototype.next 方法是将 this.state.tokens.push(new Token(this.state));
  * 就这样将es6 ，react， jsx 代码转义成ast 抽象树 收集到tonkens中

#### generate 将ast转换成es5

File.prototype.generate // 这个是将ast 代码转换成 es5 ，调用30 模块中的CodeGenerator.prototype.generate 这个方法，

30 模块中的CodeGenerator会集合es6，react，jsx语法转换模块

```
             // 把这些转义代码的方法 合并到CodeGenerator中
             //这里的模块不想在继续追查下去，太多知识点了 时间有限
              _createClass(CodeGenerator, null, [{
                key: "generators",
                value: {
                  templateLiterals: _dereq_(28),
                  comprehensions: _dereq_(21),
                  expressions: _dereq_(22),
                  statements: _dereq_(27),
                  classes: _dereq_(20),
                  methods: _dereq_(25),
                  modules: _dereq_(26),
                  types: _dereq_(29),
                  flow: _dereq_(23),
                  base: _dereq_(19),
                  jsx: _dereq_(24)
                },
                enumerable: true
              }]);
```

CodeGenerator实例化构造函数的时候会调用18模块 Buffer实例化到自己的this.buffer中。

18模块的Buffer类功能主要是打印一些空格和换行，还有一个重要的方法get是获取es6转义es5的代码的，然后获取值存放在this.buf属性中。但是要获取到转义的方法必须要先调用CodeGenerator.prototype.print 在调用Buffer.prototype.get方法才能获取到转义的代码不然this.buf会外空的值

然后在调用CodeGenerator.prototype.print  方法,这个方法里面有是把es6代码转义打印输出es5代码的。这个时候调用Buffer.prototype.get 就可以获取到转义代码了。

```
   CodeGenerator.prototype.print = function print(node, parent) {
                var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                if (!node) return;

                if (parent && parent._compact) {
                  node._compact = true;
                }

                var oldConcise = this.format.concise;
                if (node._compact) {
                  this.format.concise = true;
                }

                if (!this[node.type]) {
                  throw new ReferenceError("unknown node of type " + JSON.stringify(node.type) + " with constructor " + JSON.stringify(node && node.constructor.name));
                }
                // 检查一个节点是否要圆括号
                var needsParens = _node3["default"].needsParens(node, parent);
                if (needsParens) this.push("(");

                this.printLeadingComments(node, parent);

                this.catchUp(node);
                 // 打印空白
                this._printNewline(true, node, parent, opts);

                if (opts.before) opts.before();
                // 开始制造代码
                this.map.mark(node, "start");
                console.log('this=',this)
                console.log('this[node.type]=',this[node.type])

                this[node.type](node, this.buildPrint(node), parent);

                if (needsParens) this.push(")");
                // 结束制造代码
                this.map.mark(node, "end");
                
                if (opts.after) opts.after();

                this.format.concise = oldConcise;
                  
                this._printNewline(false, node, parent, opts);

                this.printTrailingComments(node, parent);
              };

```

模块的Buffer类属性buf就是存放编译后的代码，最终会返回到到transform模块上面,

这样我们就可以拿到es5的代码了，具体代码如下

```

                /**
                 * Tranform and execute script, adding in inline sourcemaps.
                 */
                // 运行 编译后的 javascript
                transform.run = function (code) {
                  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                  opts.sourceMaps = "inline";
                  console.log('code=', code)
                  // 编译后的代码
                  global.code = transform(code, opts).code
                  console.log('global.code=',global.code)
                  //执行编译后的代码
                  return new Function(global.code)();
                };
```

# 将babel编译后的代码，通过node服务器保存到本地

* babel代码编译之后会在babel里面直接执行，但是我们为了更好的结合react源码分析，我们希望把编译后的源码保存下来。我修改了babel这里的代码，把transform(code, opts).code赋值给 global.code，这样就global就是window。这样就可以导出代码了。

```
  /**
                 * Tranform and execute script, adding in inline sourcemaps.
                 */
                // 运行 编译后的 javascript
                transform.run = function (code) {
                  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                  opts.sourceMaps = "inline";
                  console.log('code=', code)
                  // 编译后的代码
                  global.code = transform(code, opts).code
                  console.log('global.code=',global.code)
                  //执行编译后的代码
                  return new Function(global.code)();
                };
```

* 然后我们下面用代码测试下

  * 我们的react es6代码如下

    ```
    ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    ```

  * babel 转义后为，

    ```
    'use strict';
    
    ReactDOM.render(React.createElement(
        'h1',
        null,
        'Hello, world!'
    ), document.getElementById('example'));
    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHA6Ly8xMjcuMC4wLjE6NTUwNy9lczZfY29kZS8wMS8wMS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFFBQVEsQ0FBQyxNQUFNLENBQ1g7Ozs7Q0FBc0IsRUFDdEIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FDbkMsQ0FBQyIsImZpbGUiOiJodHRwOi8vMTI3LjAuMC4xOjU1MDcvZXM2X2NvZGUvMDEvMDEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJSZWFjdERPTS5yZW5kZXIoXHJcbiAgICA8aDE+SGVsbG8sIHdvcmxkITwvaDE+LFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGUnKVxyXG4gICk7Il19
    ```
    *  但是我们不需要后面的#sourceMappingURL一大串东西，这个是 Source map，他提供了一种方式，能够将压缩文件中的代码映射回源文件中对应的位置。这意味着，你可以借助一些软件很轻易地调试应用程序中那些经过优化处理过的资源。但是我们不需要，

    * 这个时候我们可以通过修改transform.run = function (code) { 函数中的

      ```
      opts.sourceMaps = "inline"; // 去掉 Source map
      ```

## nodeServer.js 服务器代码

* 然后我们可以通过ajax发送到服务器上面。 server代码 nodeServer.js

  ```
  const http = require('http')
  const fs = require('fs');
  const path = require('path');
  const beautify = require('js-beautify').js
  // querystring 模块提供用于解析和格式化 URL 查询字符串的实用工具
  const querystring = require('querystring')
  
  const promise = (fn) => new Promise(fn)
  const mkdirCreateFile = async (codePath, content, lastPath) => {
      const reg = /\\/g;
      codePath = codePath.replace(reg, '/')
      // 截取目录
      const pathArr = codePath.split('/');
      let mkdirPath = ''
      lastPath = lastPath || '';
      if (pathArr.length > 1) {
          if (!lastPath) {
              mkdirPath = pathArr.shift();
              lastPath = mkdirPath;
          } else {
              mkdirPath = pathArr.shift();
              lastPath = `${lastPath}/${mkdirPath}`;
              mkdirPath = lastPath;
          }
          await promise((resolve, reject) => {
              // 创建目录
              fs.mkdir(path.join(__dirname, mkdirPath), async function (err) {
                  // 递归创建目录
                  resolve();
              })
          }).then(async () => {
              await mkdirCreateFile(pathArr.join('/'), content, lastPath)
          })
  
      } else {
          mkdirPath = pathArr.shift();
          mkdirPath = `${lastPath}/${mkdirPath}`;
          await promise((resolve, reject) => {
              // 写入文件
              fs.writeFile(path.join(__dirname, mkdirPath), content, async function (err) {
                  if (err) {
                      // console.log('写入失败', err);
                      reject(err)
                  } else {
                      resolve()
                      // console.log('写入成功');
                  }
              })
          })
  
      }
  
  }
  
  
  // 路由配置
  const routes = {
      createCode: {
          url: '/createCode',
          callback: function (request, response) {
              // 接收数据
              let postData = ''
              // chunk为一点点数据，逐渐积累
              request.on('data', chunk => {
                  // console.log('chunk=', chunk)
                  postData += chunk
              })
  
              request.on('end', () => {
                  let {
                      path: codePath,
                      code
                  } = querystring.parse(postData.toString())
                  code=beautify(code, { indent_size: 4, space_in_empty_paren: true })
                  console.log('codePath=', codePath)
                  console.log('code=', code)
                  mkdirCreateFile(codePath, code).then(() => {
                      console.log('文件写入成功');
                      // 在这里返回 因为是异步
                      response.end(
                          // 返回json字字符串
                          JSON.stringify({
                              message:'文件写入成功',
                              path: codePath,
                              code
                          })
                      )
                  }).catch((err) => {
                       console.log('文件写入失败', err);
                      response.end(
                          // 返回json字字符串
                          JSON.stringify({
                              message: '文件写入失败'
                          })
                      )
                  })
  
              })
          },
          type: 'post',
      },
      getCode: {
          url: '/getCode',
          callback: function (request, response) {
              // url路径
              const url = request.url
              const path = url.split('?')[0]
              // 解析  get请求的参数  为?后面  所以数组下标为1
              const getParams = querystring.parse(url.split('?')[1])
              response.end(
                  // 返回json字字符串
                  JSON.stringify({
                      ...getParams
                  })
              )
          },
          type: 'get',
      }
  
  }
  
  const server = http.createServer((req, res) => {
      //  请求的方式
      const method = req.method
      // 获取完整请求url
      const url = req.url
      //设置跨域
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
      res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      // res.setHeader("X-Powered-By", ' 3.2.1')
  
      for (let key in routes) {
          if (url.indexOf(routes[key].url) != '-1') {
              // 设置返回的格式  json格式
              res.setHeader('Content-type', 'application/json')
              if (method === 'POST' && routes[key].type == 'post') { // 0.如果是Post请求
                  routes[key].callback(req, res)
              } else if (method === 'GET' && routes[key].type == 'get') { // get请求
                  console.log('method', method)
                  routes[key].callback(req, res)
              }
              return false;
          }
      }
  
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('Hello World\n')
  
  })
  
  
  server.listen(5000, () => {
      console.log('http://localhost:5000/')
  })
  ```

  然后启动我们的server服务器。

## 客户端代码

* 前段代码将react代码发送到server端，server用文件读写把文件写进来前段代码如下

  ```
  <!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="./common/js/ajax.js"></script>
    <!--官方提供的 CDN 地址：-->
    <script src="./common/js/react.development.v16.12.0.js"></script>
    <script src="./common/js/react-dom.development.v16.12.0.js"></script>
    <!-- <script src="./common/js/browser-polyfill.5.8.38.js"></script> -->
    <script src="./common/js/browser.5.8.38.js"></script>
  
  </head>
  <style>
    .lsft-box{
      float: left;
      width: 48%;
      height: 100vh;
    }
    .right-box{
      float: right;
      width: 48%;
      height: 100vh;
    }
    *{
      padding: 0;
      margin: 0;
    }
    .textarea{
      font-size: 18px;
      display: block;
      /* width: 100%;
      height: 100vh; */
    }
  </style>
  <body>
  
    <div id="example" class="lsft-box"></div>
    <textarea id="textarea" class='textarea right-box' ></textarea> 
  
    <script src="./es6_code/es6_react_code/01/01.js" type="text/babel"></script>
    <script  >
   var oTextarea= document.getElementById('textarea');
    setTimeout(() => {
      oTextarea.value=code
      var oldCode = window.localStorage.getItem('code');
      // 如果同样代码 则不会在发送请求
      if(oldCode===code){
        return false
      }
      window.localStorage.setItem('code',code);
     //把代码发送到服务器
      ajax({
        url: "http://127.0.0.1:5000/createCode",
        type: 'post',
        data: {
          path: '/es5_code/es5_react_code/01/01.js',
          code: code,
        },
        dataType: 'json',
        timeout: 10000,
        contentType: "application/json",
        success: function (data) {
          console.log('data====',data)
        },
        //异常处理
        error: function (e) {
          console.log(e);
        }
      })
    }, 100);
    </script>  
  </body>
  
  </html>
  ```

## 整个项目地址为:<https://github.com/qq281113270/react>

项目目录以及文件

​     ![06](.\06.png)

ajax 请求后端的xhr

browser.5.8.38 babel源码

react-dom.development.v16.12.0，react.development.v16.12.0  react 源码

es5_code 是存放编译后的es5代码

es6_code 是开发者编写的e6代码

es6.html 加载执行es6 代码和babel源码和react源码

es5.html 加载执行bable 转义后的 es5，bable 和 react源码

# 开始我们的react源码分析



## 日志函数

### 警告日志函数

#### printWarning

```
// 打印警告日志 
    var printWarning = function (format) {
      // 收集一个参数后面的信息
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      // 匹配字符串 %s 如果出现一个 %s则会替换掉，第一个参数，如果出现第二个 %s 就会替换掉 第二个参数 因为指针argIndex会加加
      // 类似于 c 语言中的print
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        console.log('args=', args)
        return args[argIndex++];
      });

      if (typeof console !== 'undefined') {
        console.warn(message);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
```

#### lowPriorityWarningWithoutStack

```
 // 打印警告日志 
    lowPriorityWarningWithoutStack = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      // 收集两个参数以上的信息
      if (!condition) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }
        // 打印警告日志 
        printWarning.apply(void 0, [format].concat(args));
      }
    };

```

### 红色错误日志

#### warningWithoutStack和warningWithoutStack$1

```
 //打印错误红色错误日志
    warningWithoutStack = function (
      condition,  // 第一个参数必须是false 才会输出日志
      format // 日志信息
      ) {
      // 如果参数大于两个的时候 除了前面两个组成一个数组
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (args.length > 8) {
        // Check before the condition to catch violations early. 在条件出现之前进行检查，尽早发现违规。
        //目前最多支持8个参数。
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }

      if (condition) {
        return;
      }

      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
       // 匹配字符串 %s 如果出现一个 %s则会替换掉，第一个参数，如果出现第二个 %s 就会替换掉 第二个参数  
         // 类似于 c 语言中的print
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        // 匹配字符串 %s 如果出现一个 %s则会替换掉，第一个参数，如果出现第二个 %s 就会替换掉 第二个参数 因为指针argIndex会加加
         // 类似于 c 语言中的print
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        // 抛出异常信息
        throw new Error(message);
      } catch (x) {}
    };
```



## warnOnInvalidCallback

判断回调函数是否为空，或者不是函数，则发出警告日志

```
  // 判断callback 是否存在 如果存在 不是回调函数 那么 就会警告，该函数是无效函数
  function warnOnInvalidCallback(
    callback,  //回调的函数
    callerName //回到函数的名称
    ) {
    {
    // 这个函数要么是空的  要么必须是函数
      !(callback === null || typeof callback === "function")
        // 打印出红色错误日志
        ? 
        warningWithoutStack$1(
            false,
            "%s(...): Expected the last optional `callback` argument to be a " +
              "function. Instead received: %s.",
            callerName,
            callback
          )
        : void 0;
    }
  }
```



#  react 整个框架程序流程

## 创建createElement 数据

react 执行代码 实际上是会先调用createElement 创建一个vdon 数据