/** @license React v16.12.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// 看这个文件不用找来找去

//react.development.v16.12.0
"use strict";

(function (global, factory) {
  //cmd amd cdn 环境判断
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.React = factory());
})(this, function () {
  "use strict";

  // TODO: this is special because it gets imported during build.
  // 版本号
  var ReactVersion = "16.12.0";

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // 用于标记类反应物类型的符号。如果没有本土符号
  // nor polyfill, then a plain number is used for performance.
  // 也不是填充，然后一个普通的数字是用于性能。
  // 判断浏览器是否支持Symbol 数据类型
  var hasSymbol = typeof Symbol === "function" && Symbol.for;
  // $$typeof   更多信息 请阅读 https://juejin.im/post/5cecf286f265da1b83336dbe
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 0xeac7;

  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 0xeaca;

  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol
    ? Symbol.for("react.strict_mode")
    : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  // (unstable) APIs that have been removed. Can we remove the symbols?

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol
    ? Symbol.for("react.concurrent_mode")
    : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol
    ? Symbol.for("react.forward_ref")
    : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol
    ? Symbol.for("react.suspense_list")
    : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 0xead4;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol
    ? Symbol.for("react.fundamental")
    : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 0xead6;
  var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 0xead7;
  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = "@@iterator";

  //创建自定义迭代器  更多文档请看 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
  // 类似于Generator 函数的语法 意思 返回迭代器
  function getIteratorFn(maybeIterable) {
    // 必须不能为空，并且需要是对象
    if (maybeIterable === null || typeof maybeIterable !== "object") {
      return null;
    }

    var maybeIterator =
      (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL];

    if (typeof maybeIterator === "function") {
      return maybeIterator;
    }

    return null;
  }

  /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */

  /* eslint-disable no-unused-vars */
  // 判断Symbol对象 并且返回Symbol所有属性 数组
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  // 判断属性是否是对象实例化构造的
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  //propertyIsEnumerable() 方法返回一个布尔值，表示指定的属性是否可枚举。
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  // 将数据转换成一个对象
  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError(
        "Object.assign cannot be called with null or undefined"
      );
    }

    return Object(val);
  }

  // 判断浏览器是否支持Object.assign
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      // 下面代码是解决一些浏览器的bug
      // Detect buggy property enumeration order in older V8 versions.

      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String("abc"); // eslint-disable-line no-new-wrappers
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }

      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function (letter) {
        test3[letter] = letter;
      });
      if (
        Object.keys(Object.assign({}, test3)).join("") !==
        "abcdefghijklmnopqrst"
      ) {
        return false;
      }

      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }

  // 浅拷贝 如果浏览器没有Object.assign  重写浅拷贝
  var objectAssign = shouldUseNative()
    ? Object.assign
    : function (target, source) {
        var from;
        // 变成对象
        var to = toObject(target);
        var symbols;

        for (var s = 1; s < arguments.length; s++) {
          // 把参数变成对象
          from = Object(arguments[s]);
          // 用for in 实现浅拷贝
          for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
            }
          }
          //  判断Symbol对象 并且返回Symbol所有属性 数组
          if (getOwnPropertySymbols) {
            // 如果 对象是Symbol 数据类型
            symbols = getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
              // 获取是否可以枚举该属性。
              if (propIsEnumerable.call(from, symbols[i])) {
                // 然后实现浅拷贝
                to[symbols[i]] = from[symbols[i]];
              }
            }
          }
        }
        // 返回对象
        return to;
      };

  // Do not require this module directly! Use normal `invariant` calls with
  // template literal strings. The messages will be replaced with error codes
  // during build.

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
      *由fbjs分叉/警告:
      * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
      *
      唯一的变化是我们使用控制台。warn而不是console.error，
      *不支持“console”时不做任何事情。
      这确实简化了代码。
      * - - - - - -
      *类似于不变量，但只有在不满足条件时才记录一个警告。
      *这可以用于记录关键开发环境中的问题
      *路径。删除生产环境的日志代码将保留
      *相同的逻辑，遵循相同的代码路径。
      // 打印警告日志 
     */
  var lowPriorityWarningWithoutStack = function () {};

  {
    // 打印警告日志
    var printWarning = function (format) {
      // 收集一个参数后面的信息
      for (
        var _len = arguments.length,
          args = new Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      // 匹配字符串 %s 如果出现一个 %s则会替换掉，第一个参数，如果出现第二个 %s 就会替换掉 第二个参数 因为指针argIndex会加加
      // 类似于 c 语言中的print
      var message =
        "Warning: " +
        format.replace(/%s/g, function () {
          console.log("args=", args);
          return args[argIndex++];
        });

      if (typeof console !== "undefined") {
        console.warn(message);
      }

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    // 打印警告日志
    lowPriorityWarningWithoutStack = function (condition, format) {
      if (format === undefined) {
        throw new Error(
          "`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning " +
            "message argument"
        );
      }
      // 收集两个参数以上的信息
      if (!condition) {
        for (
          var _len2 = arguments.length,
            args = new Array(_len2 > 2 ? _len2 - 2 : 0),
            _key2 = 2;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2 - 2] = arguments[_key2];
        }
        // 打印警告日志
        printWarning.apply(void 0, [format].concat(args));
      }
    };
  }
  //打印警告日志
  var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   *类似于不变量，但只有在不满足条件时才记录一个警告。
   *这可以用于记录关键开发环境中的问题
   *路径。删除生产环境的日志代码将保留
   *相同的逻辑，遵循相同的代码路径。
   */
  var warningWithoutStack = function () {};

  {
    //打印错误红色错误日志
    warningWithoutStack = function (
      condition, // 第一个参数必须是false 才会输出日志
      format // 日志信息
    ) {
      // 如果参数大于两个的时候 除了前面两个组成一个数组
      for (
        var _len = arguments.length,
          args = new Array(_len > 2 ? _len - 2 : 0),
          _key = 2;
        _key < _len;
        _key++
      ) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error(
          "`warningWithoutStack(condition, format, ...args)` requires a warning " +
            "message argument"
        );
      }

      if (args.length > 8) {
        // Check before the condition to catch violations early. 在条件出现之前进行检查，尽早发现违规。
        //目前最多支持8个参数。
        throw new Error(
          "warningWithoutStack() currently supports at most 8 arguments."
        );
      }

      if (condition) {
        return;
      }

      if (typeof console !== "undefined") {
        var argsWithFormat = args.map(function (item) {
          return "" + item;
        });
        argsWithFormat.unshift("Warning: " + format); // We intentionally don't use spread (or .apply) directly because it
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
        var message =
          "Warning: " +
          format.replace(/%s/g, function () {
            return args[argIndex++];
          });
        // 抛出异常信息
        throw new Error(message);
      } catch (x) {}
    };
  }
  // 打印出红色错误日志
  var warningWithoutStack$1 = warningWithoutStack;

  //记录警告更新状态缓存对象
  var didWarnStateUpdateForUnmountedComponent = {};
  //记录警告更新状态缓存对象  //打印出红色错误日志
  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName =
        (_constructor && (_constructor.displayName || _constructor.name)) ||
        "ReactClass";
      var warningKey = componentName + "." + callerName;

      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      //打印出红色错误日志
      warningWithoutStack$1(
        false,
        "Can't call %s on a component that is not yet mounted. " +
          "This is a no-op, but it might indicate a bug in your application. " +
          "Instead, assign to `this.state` directly or define a `state = {};` " +
          "class property with the desired state in the %s component.",
        callerName,
        componentName
      );
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }
  /**
   * This is the abstract API for an update queue.
   */

  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    // 返回一个假
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    // 强制更新队列
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, "forceUpdate");
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (
      publicInstance,
      completeState,
      callback,
      callerName
    ) {
      warnNoop(publicInstance, "replaceState");
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (
      publicInstance,
      partialState,
      callback,
      callerName
    ) {
      warnNoop(publicInstance, "setState");
    },
  };

  var emptyObject = {};

  {
    // 冻结对象
    Object.freeze(emptyObject);
  }
  /**
   * Base class helpers for the updating state of a component.
   * 用于更新组件状态的基类帮助程序。
   *
   */

  // react 创建组件类
  function Component(props, context, updater) {
    this.props = props; // 属性 组件
    this.context = context; // If a component has string refs, we will assign a different object later. 如果一个组件有字符串引用，我们稍后将分配一个不同的对象。

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the 方法初始化默认更新器，但实际更新器被注入
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue; // 更新对象或者队列
  }
  //是否是react 组件
  Component.prototype.isReactComponent = {};
  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  // 更新 这个就是 我们查用的更新 state状态函数
  Component.prototype.setState = function (partialState, callback) {
    if (
      !(
        typeof partialState === "object" ||
        typeof partialState === "function" ||
        partialState == null
      )
    ) {
      {
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
        );
      }
    }

    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
          强制更新。这应该只在它是已知的时候被调用
          *确定我们不是在一个DOM事务中。
          *
          *你可能想要调用这个当你知道一些更深层次的方面
          组件的状态改变了，但是没有调用setState。
          *
          *这不会调用' shouldComponentUpdate '，但它会调用
          *“componentWillUpdate”和“componentDidUpdate”。

     
     */
  // 强制更新
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   
*弃用api。这些api以前存在于经典的React类中，但现在已经不存在了
我们想要贬低他们，我们不会把他们移到这里
*现代基类。相反，我们定义一个getter来警告它是否被访问。
   */
  {
    // 已经废弃的api
    var deprecatedAPIs = {
      isMounted: [
        "isMounted",
        "Instead, make sure to clean up subscriptions and pending requests in " +
          "componentWillUnmount to prevent memory leaks.",
      ],
      replaceState: [
        "replaceState",
        "Refactor your code to use setState instead (see " +
          "https://github.com/facebook/react/issues/3236).",
      ],
    };
    // 定义废弃的api  添加到观察者中，如果他使用到 那么将会警告
    var defineDeprecationWarning = function (methodName, info) {
      //添加到观察者
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          //打印警告日志
          lowPriorityWarningWithoutStack$1(
            false,
            "%s(...) is deprecated in plain JavaScript React classes. %s",
            info[0],
            info[1]
          );
          return undefined;
        },
      });
    };
    // 循环 废弃的api
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}
  // 让ComponentDummy 继承Component 原型链
  ComponentDummy.prototype = Component.prototype;
  /**
   * Convenience component with default shallow equality check for sCU.
   */

  function PureComponent(props, context, updater) {
    this.props = props; // 组件属性
    this.context = context; // If a component has string refs, we will assign a different object later. 如果一个组件有字符串引用，我们稍后将分配一个不同的对象。

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue; // 队列更新的对象
  }

  // 原型链继承
  var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());

  pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods. 避免这些方法的额外原型跳转。
  // 浅拷贝继承，这样修改 pureComponentPrototype的时候不会修改到Component.prototype
  objectAssign(pureComponentPrototype, Component.prototype);

  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value 一个具有单个可变值的不可变对象
  // 不可以添加 删除属性  只可以 修改原有的属性
  function createRef() {
    var refObject = {
      current: null,
    };

    {
      // Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。
      Object.seal(refObject);
    }

    return refObject;
  }

  /**
   * Keeps track of the current dispatcher.
   *  跟踪当前调度程序。
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
  };

  /**
   * Keeps track of the current batch's configuration such as how long an update
   * should suspend for if it needs to.
   *跟踪当前批处理的配置，比如更新多长时间
   *如有需要，应暂停。
   */
  var ReactCurrentBatchConfig = {
    suspense: null,
  };

  /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
      跟踪当前的所有者。
      *当前所有者是应该拥有任何组件的组件
      *正在施工中。
     */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
  };

  // 匹配到开头是任何 0次或者多次  是含有 /\的路径
  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
  // / 返回 index.js 来源路径和信息     比如 src/index.js
  var describeComponentFrame = function (
    name, // 名称
    source, // 来源
    ownerName //主人的名字
  ) {
    var sourceInfo = "";

    if (source) {
      var path = source.fileName;
      // 去除掉前缀路径
      var fileName = path.replace(BEFORE_SLASH_RE, "");
      // console.log("BEFORE_SLASH_RE=", path.match(BEFORE_SLASH_RE));
      // console.log("fileName=", fileName);

      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          // console.log("match=", match);

          if (match) {
            var pathBeforeSlash = match[1];

            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, "");
              // console.log("folderName=", folderName);
              // 获取到可以说是index. 和src    src/index.js
              fileName = folderName + "/" + fileName;
              // console.log("fileName=", fileName);
            }
          }
        }
      }

      sourceInfo = " (at " + fileName + ":" + source.lineNumber + ")";
    } else if (ownerName) {
      sourceInfo = " (created by " + ownerName + ")";
    }
    // 返回 index 来源路径和信息
    return "\n    in " + (name || "Unknown") + sourceInfo;
  };

  var Resolved = 1;
  //细化分解延迟组件
  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  // 获取 displayName 名称 使用方法 https://www.jianshu.com/p/50ccf6542699
  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || "";
    return (
      outerType.displayName ||
      (functionName !== ""
        ? wrapperName + "(" + functionName + ")"
        : wrapperName)
    );
  }

  //获取组件名称根据 type 返回不同的组件名称
  function getComponentName(type) {
    // console.log("getComponentName_type=", type);
    if (type == null) {
      // Host root, text node or just invalid type.   root，文本节点或只是无效类型。
      return null;
    }

    {
      // 如果标签是number
      if (typeof type.tag === "number") {
        //打印出红色错误日志
        warningWithoutStack$1(
          false,
          "Received an unexpected object in getComponentName(). " +
            "This is likely a bug in React. Please file an issue."
        );
      }
    }
    // 如果 type 是函数 直接返回名称
    if (typeof type === "function") {
      return type.displayName || type.name || null;
    }
    // 如果是 字符串直接返回
    if (typeof type === "string") {
      return type;
    }
    // 如果type是 react定义的一些常量 则返回 对应的字符串
    switch (type) {
      // Fragment 组件  更多 文档 https://zh-hans.reactjs.org/docs/fragments.html#___gatsby
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      //Portal  // 更多 文档 https://segmentfault.com/r/1250000011570557?shareId=1210000011570558
      case REACT_PORTAL_TYPE:
        return "Portal";
      // Profiler  组件  官方文档 https://zh-hans.reactjs.org/docs/profiler.html#___gatsby
      case REACT_PROFILER_TYPE:
        return "Profiler";
      // StrictMode  组件 官方文档 https://zh-hans.reactjs.org/docs/strict-mode.html#___gatsby
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";

      //Suspense  组件   官方文档 https://zh-hans.reactjs.org/docs/strict-mode.html#___gatsby
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      //SuspenseList  组件  https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#suspenselist
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
    }

    if (typeof type === "object") {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return "Context.Consumer";

        case REACT_PROVIDER_TYPE:
          return "Context.Provider";

        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, "ForwardRef");

        case REACT_MEMO_TYPE:
          //获取组件名称根据 type 返回不同的名称
          return getComponentName(type.type);

        case REACT_LAZY_TYPE: {
          var thenable = type;
          //细化分解延迟Lazy组件  
          var resolvedThenable = refineResolvedLazyComponent(thenable);

          if (resolvedThenable) {
            //获取组件名称根据 type 返回不同的名称
            return getComponentName(resolvedThenable);
          }

          break;
        }
      }
    }

    return null;
  }

  //  // 获得堆栈附录
  var ReactDebugCurrentFrame = {};
  var currentlyValidatingElement = null;
  // 校验当前元素
  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer. 当前渲染器注入的堆栈实现。
    ReactDebugCurrentFrame.getCurrentStack = null;
    // 获得堆栈附录
    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = ""; // Add an extra top frame while an element is being validated

      if (currentlyValidatingElement) {
        //获取组件名称根据 type 返回不同的组件名称
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        // / 返回 index.js 来源路径和信息     比如 src/index.js
        stack += describeComponentFrame(
          name,
          currentlyValidatingElement._source,
          owner &&
            //获取组件名称根据 type 返回不同的组件名称
            getComponentName(owner.type)
        );
      } // Delegate to the injected renderer-specific implementation

      // 获取到当前任务
      var impl = ReactDebugCurrentFrame.getCurrentStack;

      if (impl) {
        stack += impl() || "";
      }

      return stack;
    };
  }

  /**
   * Used by act() to track whether you're inside an act() scope. 由act()使用，以跟踪您是否处于act()范围内。
   */
  var IsSomeRendererActing = {
    current: false,
  };

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher, //  跟踪当前调度程序。
    ReactCurrentBatchConfig: ReactCurrentBatchConfig, // *跟踪当前批处理的配置，比如更新多长时间  ,  *如有需要，应暂停。
    ReactCurrentOwner: ReactCurrentOwner, //跟踪当前的所有者。*当前所有者是应该拥有任何组件的组件 *正在执行中。
    IsSomeRendererActing: IsSomeRendererActing, //由act()使用，以跟踪您是否处于act()范围内。
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign, //浅拷贝函数
  };

  {
    objectAssign(ReactSharedInternals, {
      // These should not be included in production. 这些不应该包括在生产中。
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this. 用于DOM 16.0.0的垫片仍然破坏(但没有使用)这个。
      // TODO: remove in React 17.0. 待办事项:在17.0 react中移除。
      ReactComponentTreeHook: {},
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   *类似于不变量，但只有在不满足条件时才记录一个警告。
   *这可以用于在关键的开发环境中记录问题
   *路径。删除生产环境的日志代码将保留
   *相同的逻辑，遵循相同的代码路径。
   */
  // 打印出红色错误日志
  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }

      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum(); // eslint-disable-next-line react-internal/warning-and-invariant-args
      // 如果参数大于第二个的时候 收集错误参数信息
      for (
        var _len = arguments.length,
          args = new Array(_len > 2 ? _len - 2 : 0),
          _key = 2;
        _key < _len;
        _key++
      ) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(
        void 0,
        [false, format + "%s"].concat(args, [stack])
      );
    };
  }
  // 打印出红色错误日志
  var warning$1 = warning;
  // 判断对象属性是否是构造函数实例化的
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  // 保留的 属性 用于 用户在state 中不能使用该属性
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
  };
  var specialPropKeyWarningShown;
  var specialPropRefWarningShown;
  /*
        判断config 中有没有 使用Object.defineProperty()添加描述属性 为ref
        var config= {

        };
        var bValue=1
        Object.defineProperty(config, "ref", {
            get: function () {
                return bValue;
            },
            set: function (newValue) {
                bValue = newValue;
            },
            enumerable: true,
            configurable: true
        });
 
        如果 config 有做过这样的添加过ref 那么他返回值则为假
         
       */

  function hasValidRef(config) {
    {
      if (hasOwnProperty$1.call(config, "ref")) {
        var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
        // console.log("getter=", getter);
        //如果取值器存在，并且取值器上的isReactWarning为true，就说明有错误，返回false，ref不合法
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.ref !== undefined;
  }

  /*
        判断config 中有没有 使用Object.defineProperty()添加描述属性 为key
        var config= {

        };
        var bValue=1
        Object.defineProperty(config, "key", {
            get: function () {
                return bValue;
            },
            set: function (newValue) {
                bValue = newValue;
            },
            enumerable: true,
            configurable: true
        });
 
        如果 config 有做过这样的添加过ref 那么他返回值则为假
         
       */
  function hasValidKey(config) {
    {
      if (hasOwnProperty$1.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;

        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }

    return config.key !== undefined;
  }

  // 定义属性key 读取 警告方法 意思是在组件中key 是不能访问的
  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        // 打印出红色错误日志
        warningWithoutStack$1(
          false,
          "%s: `key` is not a prop. Trying to access it will result " +
            "in `undefined` being returned. If you need to access the same " +
            "value within the child component, you should pass it as a different " +
            "prop. (https://fb.me/react-special-props)",
          displayName
        );
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, "key", {
      get: warnAboutAccessingKey,
      configurable: true,
    });
  }
  // 定义属性ref 读取 警告方法 意思是在组件中ref是不能访问的
  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        // 打印出红色错误日志
        warningWithoutStack$1(
          false,
          "%s: `ref` is not a prop. Trying to access it will result " +
            "in `undefined` being returned. If you need to access the same " +
            "value within the child component, you should pass it as a different " +
            "prop. (https://fb.me/react-special-props)",
          displayName
        );
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, "ref", {
      get: warnAboutAccessingRef,
      configurable: true,
    });
  }
  /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, instanceof check
     * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} props
     * @param {*} key
     * @param {string|object} ref
     * @param {*} owner
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @internal
      *创建一个新的React元素的工厂方法。这已不再坚持
      *类模式，所以不要用new来调用它。此外,instanceof检查
      *行不通。而是将$$typeof field与Symbol.for(' response .element')进行测试
      如果某物是一个React元素。
      *
      * @param{*}类型
      * @param{*}道具
      * @param{*}键
      * @param {string|object} ref
      * @param{*}所有者
      * @param {*} self是一个检测“this”所在位置的“临时”助手
      *不同于“所有者”的反应。调用createElement，这样我们
      *可以警告。我们想摆脱所有者和替换字符串' ref '与箭头
      *功能，只要‘this’和owner是一样的，就不会有
      改变行为。
      * @param{*}源注释对象(由置换器或其他方式添加)
      *表示文件名、行号和/或其他信息。
      * @internal
     */

  var ReactElement = function (
    type, // 标签的类型
    key, // 组件key 属性
    ref, // ref 属性
    self, // 如果没有配置config.__self  则为空
    source, // 如果没有配置config.__source  则为空
    owner, // null
    props // 标签属性
  ) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      // 这个标记允许我们唯一地将其标识为React元素
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element 属于元素的内置属性
      type: type, // 标签名词比如 <h1>
      key: key, // 标签key
      ref: ref, // ref属性
      props: props, // pros 属性
      // Record the component responsible for creating this element.
      _owner: owner, //记录负责创建此元素的组件。
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      //验证标志当前是可变的。我们把它戴上
      //一个外部后备存储器，这样我们就可以冻结整个对象。
      //这可以用一个WeakMap来代替，一旦它们被实现
      //常用的开发环境。
      element._store = {};
      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      //为了使比较react更便于测试，我们做了
      //验证标志不可枚举(可能的话，应该是不可枚举的)
      //包括我们运行测试的每个环境)，也就是测试框架
      //忽略它。
      /*
            Object.defineProperty 更多参考
            https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
            */
      Object.defineProperty(element._store, "validated", {
        configurable: false, // 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
        enumerable: false, //当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为
        writable: true, //当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
        value: false, // 对象属性值
      }); // self and source are DEV only properties. self和source是DEV独有的属性。

      Object.defineProperty(element, "_self", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self, // ref属性
      }); // Two elements created in two different places should be considered 应该考虑在两个不同地方创建的两个元素
      // equal for testing purposes and therefore we hide it from enumeration. 相等的测试目的，因此我们隐藏它从枚举。

      Object.defineProperty(element, "_source", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source, // 空
      });

      if (Object.freeze) {
        // 冻结属性
        Object.freeze(element.props);
        // 冻结对象
        Object.freeze(element);
      }
    }
    // console.log("element1===", element);

    return element;
  };
  /**
   * https://github.com/reactjs/rfcs/pull/107
   * @param {*} type
   * @param {object} props
   * @param {string} key
   */

  /**
   * https://github.com/reactjs/rfcs/pull/107
   * @param {*} type
   * @param {object} props
   * @param {string} key
   */

  function jsxDEV(type, config, maybeKey, source, self) {
    var propName; // Reserved names are extracted 提取保留名

    var props = {};
    var key = null;
    var ref = null;
    // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.
    //目前，钥匙可以作为道具传播。这就产生了一个势
    //问题，如果键也显式声明(即。< div {…关键道具}= "嗨" / >
    //或<div key="Hi"{…道具}/ >)。我们不赞成键扩散，
    //但是作为一个中间步骤，我们将使用jsxDEV处理除
    // < div {…道具}key="Hi" />，因为我们目前还不能判断
    //键被显式声明为未定义或未定义。

    if (maybeKey !== undefined) {
      key = "" + maybeKey;
    }
    //   判断config 中有没有 使用Object.defineProperty()添加描述属性 为key
    if (hasValidKey(config)) {
      key = "" + config.key;
    }
    // 判断config 中有没有 使用Object.defineProperty()添加描述属性 为ref
    if (hasValidRef(config)) {
      ref = config.ref;
    } // Remaining properties are added to a new props object

    // 合并 props 属性
    for (propName in config) {
      // 判断是否是实例化属性，并不是Property上的属性
      //过滤掉下面属性
      //   var RESERVED_PROPS = {
      //     key: true,
      //     ref: true,
      //     __self: true,
      //     __source: true
      // };
      if (
        hasOwnProperty$1.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        // 合并属性
        props[propName] = config[propName];
      }
    } // Resolve default props

    // 合并默认属性到props中
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName =
        typeof type === "function"
          ? type.displayName || type.name || "Unknown"
          : type;

      if (key) {
        // 定义属性key 读取 警告方法 意思是在组件中key 是不能访问的
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        // 定义属性key 读取 警告方法 意思是在组件中key 是不能访问的
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(
      type,
      key, // 组件key
      ref,
      self,
      source,
      ReactCurrentOwner.current, //null
      props
    );
  }
  /**
   * Create and return a new ReactElement of the given type. 创建并返回给定类型的新ReactElement。
   * See https://reactjs.org/docs/react-api.html#createelement
   * 创建并返回给定类型的新React元素。
   * type参数可以是标签名称字符串（例如'div'或'span'），
   * React组件类型（类或函数）或React片段类型。
   *
   */

  function createElement(
    type, // 标签
    config, // 属性
    children // 子节点
  ) {
    var propName; // Reserved names are extracted 提取保留名

    var props = {}; // 节点属性
    var key = null; // 节点的key
    var ref = null; // 节点ref 用来操作dom
    var self = null;
    var source = null;
    //赋给标签的props不为空时
    if (config != null) {
      // 如果 含有ref 属性
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      // 如果含有key
      if (hasValidKey(config)) {
        key = "" + config.key;
      }
      // 如果没有配置config.__self  则为空
      self = config.__self === undefined ? null : config.__self;
      // 如果没有配置config.__source  则为空
      source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object
      /*
            把属性浅拷贝到props 对象中
            但是需要过滤掉这些属性
              key: true,
              ref: true,
              __self: true,
              __source: true

            */
      // 合并 config 对象到 props 属性中
      for (propName in config) {
        //过滤掉下面属性
        //   var RESERVED_PROPS = {
        //     key: true,
        //     ref: true,
        //     __self: true,
        //     __source: true
        // };
        if (
          hasOwnProperty$1.call(config, propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
          // 合并属性
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto 孩子们可以有不止一个论点，这些论点会被转移到
    // the newly allocated props object. 新分配的道具对象。

    // 获取节点参数长度
    var childrenLength = arguments.length - 2;
    // 如果参数只是一个 那么直接挂在在 props.children 中
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      // 如果child参数大于1个以上则会把他变成一个数组
      var childArray = Array(childrenLength);
      /*  把 react vonde 合并到数组中
             主要因为如果是多个子节点 参数是这样穿的
             var H = function H() {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "h1",
                            null,
                            "这个是标题"
                        ),
                        React.createElement(
                            "p",
                            null,
                            "这个是内容"
                        )
                    );
                };
                    
            */
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      {
        if (Object.freeze) {
          // 冻结对象， 禁止修改他
          Object.freeze(childArray);
        }
      }
      // 变成一个数组之后挂在在props.children  中
      props.children = childArray;
    } // Resolve default props

    /*
  判断 组件 节点是否有默认属性
  class Children extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '我是子组件',
            msg: '子组件传值给父组件'
        }
    }

    render() {
        return (
            <div>
                <h2>{ this.state.name }</h2>
                <h3>子组件的msg为：{ this.state.msg }</h3>
                <h3>父组件传来的msg为：{ this.props.msg }</h3>
            </div>
        )
    }
}

// defaultProps
Children.defaultProps = {
    msg: '默认父组件传来的值'
}
  */
    // 如果有默认属性则把他添加到属性中
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      // 循环 默认属性
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    {
      // 如果有key或者ref的时候
      if (key || ref) {
        var displayName =
          typeof type === "function"
            ? type.displayName || type.name || "Unknown"
            : type;

        if (key) {
          // 定义属性key 读取 警告方法
          defineKeyPropWarningGetter(props, displayName);
        }

        if (ref) {
          // 定义属性ref 读取 警告方法 意思是在组件中ref是不能访问的
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }

    return ReactElement(
      type, // 标签名词，组件或者函数
      key, // key 属性
      ref, // ref 属性
      self, // 如果没有配置config.__self  则为空
      source, // 如果没有配置config.__source  则为空
      ReactCurrentOwner.current, // null
      props // 标签属性
    );
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */

  // 克隆和 替换key 返回新的 react dom
  function cloneAndReplaceKey(
    oldElement, // 就得react dom
    newKey // 新的key
  ) {
    var newElement = ReactElement(
      oldElement.type,
      newKey,
      oldElement.ref,
      oldElement._self,
      oldElement._source,
      oldElement._owner,
      oldElement.props
    );
    return newElement;
  }
  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */

  function cloneElement(element, config, children) {
    if (!!(element === null || element === undefined)) {
      {
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " +
            element +
            "."
        );
      }
    }

    var propName; // Original props are copied  原始的 props

    var props = objectAssign({}, element.props); // Reserved names are extracted

    var key = element.key; // key 属性
    var ref = element.ref; // ref 属性 Self is preserved since the owner is preserved.

    /*
            由于cloneElement不太可能成为a的目标，所以保留了源
        //编译器，而原始源文件可能是更好的指示器
         真正的所有者。

        */

    var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.

    var source = element._source; // Owner will be preserved, unless ref is overridden 除非ref被覆盖，否则所有者将被保留

    var owner = element._owner;

    if (config != null) {
      // 如果没有配置config
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref; // 获取原来的 ref
        owner = ReactCurrentOwner.current; // 获取当前组件的
      }

      if (hasValidKey(config)) {
        key = "" + config.key; // 获取配置key
      } // Remaining properties override existing props

      var defaultProps;
      // 拷贝默认属性的 defaultProps对象中
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      // 拷贝默认属性的 props对象中
      for (propName in config) {
        if (
          hasOwnProperty$1.call(config, propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.

    var childrenLength = arguments.length - 2;
    // 获取 子节点 同理 和 createElement 方法一样这里不多说
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }

      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }
  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  // 检验是否是react vonde
  function isValidElement(object) {
    return (
      typeof object === "object" &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE
    );
  }

  var SEPARATOR = ".";
  var SUBSEPARATOR = ":";
  /**
   * Escape and wrap key so it is safe to use as a reactid   Escape和wrap键，所以它是安全的使用作为一个react
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  /*
     字符串转义  如果 匹配上 = 那么就会转义成 =0 。
     如果匹配会上 ：就会转义成 =2
     比如传进来是 key=asdc  那么将会返回 key$=0asdc 
    */
  function escape(key) {
    // 匹配 =或者:
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      "=": "=0",
      ":": "=2",
    };
    // 替换字符串
    var escapedString = ("" + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });
    // 返回字符串
    return "$" + escapedString;
  }
  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;
  // 匹配 / 一次或者多次
  var userProvidedKeyEscapeRegex = /\/+/g;

  // 转义 如果匹配到 / 转义成 $&/
  function escapeUserProvidedKey(text) {
    return ("" + text).replace(userProvidedKeyEscapeRegex, "$&/");
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  // 合并遍历上下文
  function getPooledTraverseContext(
    mapResult,
    keyPrefix,
    mapFunction,
    mapContext
  ) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0,
      };
    }
  }
  //释放导线上下文
  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;

    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }
  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */

  //遍历所有的子结点 返回子节点的数量
  function traverseAllChildrenImpl(
    children,
    nameSoFar,
    callback,
    traverseContext
  ) {
    var type = typeof children;

    if (type === "undefined" || type === "boolean") {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (
        type // 如果类似是 string或者number
      ) {
        case "string":
        case "number":
          invokeCallback = true;
          break;

        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(
        traverseContext,
        children, // If it's the only child, treat the name as if it was wrapped in an array //如果它是唯一的子元素，就把它当作一个数组来包装
        // so that it's consistent if the number of children grows. /因此，如果孩子的数量增加，这是一致的。
        // 获取组件的kye
        nameSoFar === "" ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
      );
      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree. 当前子树中找到的子树的计数。
    /*
        
          var SEPARATOR = '.';

         var SUBSEPARATOR = ':';
        
        */
    // 下一个名称前缀
    var nextNamePrefix =
      nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      // 如果子节点存在
      // 遍历循环子节点
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        // 获取组件的kye   这里会收集多层kye  比如  a.b.c.d 这样意思
        nextName = nextNamePrefix + getComponentKey(child, i);
        //遍历所有的子结点 返回子节点的数量
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else {
      // 类似于Generator 函数的语法 意思 返回迭代器 自定义一个迭代器
      var iteratorFn = getIteratorFn(children);

      if (typeof iteratorFn === "function") {
        {
          // Warn about using Maps as children 警告children不要使用地图
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps
              ? // 打印出红色错误日志
                warning$1(
                  false,
                  "Using Maps as children is unsupported and will likely yield " +
                    "unexpected results. Convert it to a sequence/iterable of keyed " +
                    "ReactElements instead."
                )
              : void 0;
            didWarnAboutMaps = true;
          }
        }
        // 类似于Generator 函数的语法 意思 返回迭代器 自定义一个迭代器
        var iterator = iteratorFn.call(children);
        var step;
        var ii = 0;
        // 循环迭 Generator 代器
        while (!(step = iterator.next()).done) {
          // 下一个child 值
          child = step.value;
          // 获取组件的kye   这里会收集多层kye  比如  a.b.c.d 这样意思
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          // 递归
          subtreeCount += traverseAllChildrenImpl(
            child,
            nextName,
            callback,
            traverseContext
          );
        }
      } else if (type === "object") {
        var addendum = "";

        {
          addendum =
            " If you meant to render a collection of children, use an array " +
            "instead." +
            ReactDebugCurrentFrame.getStackAddendum();
        }

        var childrenString = "" + children;

        {
          {
            throw Error(
              "Objects are not valid as a React child (found: " +
                (childrenString === "[object Object]"
                  ? "object with keys {" +
                    Object.keys(children).join(", ") +
                    "}"
                  : childrenString) +
                ")." +
                addendum
            );
          }
        }
      }
    }
    // 返回子节点的数量
    return subtreeCount;
  }
  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */

  //遍历所有的子结点 返回子节点的数量
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }
    //遍历所有的子结点 返回子节点的数量
    return traverseAllChildrenImpl(children, "", callback, traverseContext);
  }
  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */

  // 获取组件的kye
  function getComponentKey(
    component, //
    index
  ) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    //在这里做一些类型划分，因为我们称之为盲目。我们想要确保
    //我们不会阻止潜在的未来ES api。
    if (
      typeof component === "object" &&
      component !== null &&
      component.key != null
    ) {
      // Explicit key
      /*
    字符串转义  如果 匹配上 = 那么就会转义成 =0 。
    如果匹配会上 ：就会转义成 =2
    比如传进来是 key=asdc  那么将会返回 key$=0asdc 
   */
      return escape(component.key);
    } // Implicit key determined by the index in the set 由集合中的索引确定的隐式键

    return index.toString(36); //转换36进制，其他一些也可以，比如toString(2)、toString(8)，代表输出为二进制和八进制。
  }
  // 调用 func 回调函数
  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
      context = bookKeeping.context;
    func.call(context, child, bookKeeping.count++);
  }
  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */

  // 循环 所有的 子节点  合并遍历上下文
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    // 合并遍历上下文
    var traverseContext = getPooledTraverseContext(
      null,
      null,
      forEachFunc,
      forEachContext
    );
    //遍历所有的子结点 返回子节点的数量
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    //释放导线上下文
    releaseTraverseContext(traverseContext);
  }
  // 合并遍历上下文 改变  bookKeeping.result  改变mappedChild 替换mappedChild key
  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;
    var mappedChild = func.call(context, child, bookKeeping.count++);

    if (Array.isArray(mappedChild)) {
      // 合并遍历上下文
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      // 检验是否是react vonde
      if (isValidElement(mappedChild)) {
        // 克隆和 替换key 返回新的 react dom
        mappedChild = cloneAndReplaceKey(
          mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix +
            (mappedChild.key && (!child || child.key !== mappedChild.key)
              ? // 转义 如果匹配到 / 转义成 $&/
                escapeUserProvidedKey(mappedChild.key) + "/"
              : "") +
            childKey
        );
      }

      result.push(mappedChild);
    }
  }
  // 合并遍历上下文
  function mapIntoWithKeyPrefixInternal(
    children,
    array,
    prefix,
    func,
    context
  ) {
    var escapedPrefix = "";

    if (prefix != null) {
      // 转义 如果匹配到 / 转义成 $&/
      escapedPrefix = escapeUserProvidedKey(prefix) + "/";
    }
    // 合并遍历上下文
    var traverseContext = getPooledTraverseContext(
      array,
      escapedPrefix,
      func,
      context
    );
    //遍历所有的子结点 返回子节点的数量
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    //释放导线上下文
    releaseTraverseContext(traverseContext);
  }
  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */

  // 合并遍历上下文
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }

    var result = [];
    // 合并遍历上下文
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }
  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */

  // 计算子节点数量 遍历所有的子结点 返回子节点的数量
  function countChildren(children) {
    //遍历所有的子结点 返回子节点的数量
    return traverseAllChildren(
      children,
      function () {
        return null;
      },
      null
    );
  }
  /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     * 
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
     * 
     * 
     * 
     * *压平一个children对象(通常指定为' props.children ')和
*返回一个数组，其中包含适当的重新键入的子元素。
    使用文档 https://segmentfault.com/a/1190000011527160
     */

  // 把children变成数组
  function toArray(children) {
    var result = [];
    // 合并遍历上下文
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }
  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */

  // 检验是否是react vonde
  function onlyChild(children) {
    // 检验是否是react vonde
    if (!isValidElement(children)) {
      {
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      }
    }

    return children;
  }
  // 作用：
  // 方便祖先组件与后代组件（中间隔了好多层组件）传值

  function createContext(
    defaultValue, // 默认值
    //使用Object.is()计算新老context的差异
    calculateChangedBits
  ) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(
          calculateChangedBits === null ||
          typeof calculateChangedBits === "function"
        )
          ? // 打印出红色错误日志
            warningWithoutStack$1(
              false,
              "createContext: Expected the optional second argument to be a " +
                "function. Instead received: %s",
              calculateChangedBits
            )
          : void 0;
      }
    }

    var context = {
      //还是那句话，ReactContext中的$$typeof是
      // 作为createElement中的属性type中的对象进行存储的，并不是ReactElement的$$typeof
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // /作为支持多个并发渲染器的解决方法，我们将一些渲染器分类为主要渲染器，将其他渲染器分类为辅助渲染器。
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.

      //为了支持多个并发渲染器，我们对其进行了分类
      //有些渲染器是主要的，有些是次要的。我们只希望
      //最多有两个并发渲染器:React Native(主渲染器)和React Native(主渲染器)
      //面料(二级);React DOM (primary)和React ART (secondary)。
      //二级渲染器将它们的上下文值存储在不同的字段中
      //也就是说_currentValue和_currentValue2作用是一样的，只是分别给主渲染器和辅助渲染器使用
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      //用于跟踪当前有多少并发渲染器
      //支持在一个单一的渲染器。比如并行服务器渲染。
      //用来追踪该context的并发渲染器的数量
      _threadCount: 0,
      // These are circular
      // 暴露接口
      Provider: null,
      Consumer: null,
    };
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context,
    };
    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      //一个单独的对象，但将其代理回原来的上下文对象
      //向后兼容性。它有一个不同的$$类型，所以我们可以适当地
      //警告使用者不正确地使用上下文。
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits,
      }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here
      // 日志
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(
                false,
                "Rendering <Context.Consumer.Provider> is not supported and will be removed in " +
                  "a future major release. Did you mean to render <Context.Provider> instead?"
              );
            }

            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          },
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          },
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          },
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          },
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(
                false,
                "Rendering <Context.Consumer.Consumer> is not supported and will be removed in " +
                  "a future major release. Did you mean to render <Context.Consumer> instead?"
              );
            }

            return context.Consumer;
          },
        },
      }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }
  // 组件懒加载
  function lazy(ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor, //函数
      // React uses these fields to store the result. React使用这些字段来存储结果。
      _status: -1,
      _result: null,
    };

    {
      // In production, this would just set it on the object. 在生产中，这只是将它设置在对象上。
      var defaultProps;
      var propTypes;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            //打印出红色错误日志
            warning$1(
              false,
              "React.lazy(...): It is not supported to assign `defaultProps` to " +
                "a lazy component import. Either specify them where the component " +
                "is defined, or create a wrapping component around it."
            );
            defaultProps = newDefaultProps; // Match production behavior more closely:

            Object.defineProperty(lazyType, "defaultProps", {
              enumerable: true,
            });
          },
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            //打印出红色错误日志
            warning$1(
              false,
              "React.lazy(...): It is not supported to assign `propTypes` to " +
                "a lazy component import. Either specify them where the component " +
                "is defined, or create a wrapping component around it."
            );
            propTypes = newPropTypes; // Match production behavior more closely:

            Object.defineProperty(lazyType, "propTypes", {
              enumerable: true,
            });
          },
        },
      });
    }

    return lazyType;
  }
  // 错误日志 判断 render 是否正确
  function forwardRef(render) {
    {
      // 如果组件 render.$$typeof 等于 react.memo
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        // 打印出红色错误日志
        warningWithoutStack$1(
          false,
          "forwardRef requires a render function but received a `memo` " +
            "component. Instead of forwardRef(memo(...)), use " +
            "memo(forwardRef(...))."
        );
      } else if (typeof render !== "function") {
        // 如果render 不是函数
        // 打印出红色错误日志
        warningWithoutStack$1(
          false,
          "forwardRef requires a render function but was given %s.",
          render === null ? "null" : typeof render
        );
      } else {
        !(
          // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
          // render 如果 render 是数组 他的长度等于0 或者2 发出报错
          (render.length === 0 || render.length === 2)
        )
          ? // 打印出红色错误日志
            warningWithoutStack$1(
              false,
              "forwardRef render functions accept exactly two parameters: props and ref. %s",
              render.length === 1
                ? "Did you forget to use the ref parameter?"
                : "Any additional parameter will be undefined."
            )
          : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null)
          ? // 打印出红色错误日志
            warningWithoutStack$1(
              false,
              "forwardRef render functions do not support propTypes or defaultProps. " +
                "Did you accidentally pass a React component?"
            )
          : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render,
    };
  }

  //注:它的类型可能是不同的“符号”或“数字”，如果它是一个polyfill。
  // 判断雷是否是字符串或者方法，或者是对象，或这是react 定义的一些常量
  function isValidElementType(type) {
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    return (
      typeof type === "string" ||
      typeof type === "function" ||
      type === REACT_FRAGMENT_TYPE ||
      type === REACT_CONCURRENT_MODE_TYPE ||
      type === REACT_PROFILER_TYPE ||
      type === REACT_STRICT_MODE_TYPE ||
      type === REACT_SUSPENSE_TYPE ||
      type === REACT_SUSPENSE_LIST_TYPE ||
      (typeof type === "object" &&
        type !== null &&
        (type.$$typeof === REACT_LAZY_TYPE ||
          type.$$typeof === REACT_MEMO_TYPE ||
          type.$$typeof === REACT_PROVIDER_TYPE ||
          type.$$typeof === REACT_CONTEXT_TYPE ||
          type.$$typeof === REACT_FORWARD_REF_TYPE ||
          type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
          type.$$typeof === REACT_RESPONDER_TYPE ||
          type.$$typeof === REACT_SCOPE_TYPE))
    );
  }
  //注:它的类型可能是不同的“符号”或“数字”，如果它是一个polyfill。
  // 判断雷是否是字符串或者方法，或者是对象，或这是react 定义的一些常量
  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        // 打印出红色错误日志
        warningWithoutStack$1(
          false,
          "memo: The first argument must be a component. Instead " +
            "received: %s",
          type === null ? "null" : typeof type
        );
      }
    }

    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare,
    };
  }
  // 当前调度程序
  function resolveDispatcher() {
    // console.log(
    //   "ReactCurrentDispatcher.current=",
    //   ReactCurrentDispatcher.current
    // );
    var dispatcher = ReactCurrentDispatcher.current;

    if (!(dispatcher !== null)) {
      {
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem."
        );
      }
    }

    return dispatcher;
  }
  // 获取 Context 值
  function useContext(Context, unstable_observedBits) {
    // 当前调度程序
    var dispatcher = resolveDispatcher();

    {
      !(unstable_observedBits === undefined)
        ? //打印出红色错误日志
          warning$1(
            false,
            "useContext() second argument is reserved for future " +
              "use in React. Passing it is not supported. " +
              "You passed: %s.%s",
            unstable_observedBits,
            typeof unstable_observedBits === "number" &&
              Array.isArray(arguments[2])
              ? "\n\nDid you call array.map(useContext)? " +
                  "Calling Hooks inside a loop is not supported. " +
                  "Learn more at https://fb.me/rules-of-hooks"
              : ""
          )
        : void 0; // TODO: add a more generic warning for invalid values.

      if (Context._context !== undefined) {
        var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.

        if (realContext.Consumer === Context) {
          //打印出红色错误日志
          warning$1(
            false,
            "Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be " +
              "removed in a future major release. Did you mean to call useContext(Context) instead?"
          );
        } else if (realContext.Provider === Context) {
          //打印出红色错误日志
          warning$1(
            false,
            "Calling useContext(Context.Provider) is not supported. " +
              "Did you mean to call useContext(Context) instead?"
          );
        }
      }
    }

    return dispatcher.useContext(Context, unstable_observedBits);
  }
  //Hook 使用 返回一个数组 const [state, setState] = useState(initialState);
  function useState(initialState) {
    // 当前调度程序
    var dispatcher = resolveDispatcher();
    // console.log("dispatcher.useState=", dispatcher.useState);
    //  返回 state 和 设置state的
    return dispatcher.useState(initialState);
  }

  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }
  var emptyObject$1 = {};

  function useResponder(responder, listenerProps) {
    var dispatcher = resolveDispatcher();

    {
      if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
        //打印出红色错误日志
        warning$1(
          false,
          "useResponder: invalid first argument. Expected an event responder, but instead got %s",
          responder
        );
        return;
      }
    }

    return dispatcher.useResponder(responder, listenerProps || emptyObject$1);
  }

  function useTransition(config) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useTransition(config);
  }

  function useDeferredValue(value, config) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDeferredValue(value, config);
  }

  function withSuspenseConfig(scope, config) {
    var previousConfig = ReactCurrentBatchConfig.suspense;
    ReactCurrentBatchConfig.suspense = config === undefined ? null : config;

    try {
      scope();
    } finally {
      ReactCurrentBatchConfig.suspense = previousConfig;
    }
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";

  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  // 打印红色错误日志
  var printWarning$1 = function () {};

  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    var has = Function.call.bind(Object.prototype.hasOwnProperty);
    // 打印红色错误日志
    printWarning$1 = function (text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     * *断言值与类型规范匹配。
       错误信息会被记住，并且只显示一次
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
  // 检测typeSpecs 的 方法 是不是函数 如果不是则发出错误警告
  function checkPropTypes(
    typeSpecs, //typeSpecs 对象里面是方法   
    values, // 值
    location,
    componentName,
    getStack
  ) {
    {
      for (var typeSpecName in typeSpecs) {
        // 循环typeSpecs 对象
        if (has(typeSpecs, typeSpecName)) {
          // 判断判断里面的方法 是不是实例化的
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== "function") {
              var err = Error(
                (componentName || "React class") +
                  ": " +
                  location +
                  " type `" +
                  typeSpecName +
                  "` is invalid; " +
                  "it must be a function, usually from the `prop-types` package, but received `" +
                  typeof typeSpecs[typeSpecName] +
                  "`."
              );
              err.name = "Invariant Violation";
              throw err;
            }
            error = typeSpecs[typeSpecName](
              values,
              typeSpecName,
              componentName,
              location,
              null,
              ReactPropTypesSecret
            );
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            //打印红色错误日志
            printWarning$1(
              (componentName || "React class") +
                ": type specification of " +
                location +
                " `" +
                typeSpecName +
                "` is invalid; the type checker " +
                "function must return `null` or an `Error` but returned a " +
                typeof error +
                ". " +
                "You may have forgotten to pass an argument to the type checker " +
                "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " +
                "shape all require an argument)."
            );
          }
          if (
            error instanceof Error &&
            !(error.message in loggedTypeFailures)
          ) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : "";
            //打印红色错误日志
            printWarning$1(
              "Failed " +
                location +
                " type: " +
                error.message +
                (stack != null ? stack : "")
            );
          }
        }
      }
    }
  }

  /**
   * Resets warning cache when testing.
   *
   * @private
   */
  checkPropTypes.resetWarningCache = function () {
    {
      loggedTypeFailures = {};
    }
  };

  var checkPropTypes_1 = checkPropTypes;

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */
  var propTypesMisspellWarningShown;

  {
    propTypesMisspellWarningShown = false;
  }

  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

  // 获取声明错误信息
  function getDeclarationErrorAddendum() {
    // 该属性一般是为空
    if (ReactCurrentOwner.current) {
      //获取组件名称根据 type 返回不同的组件名称
      var name = getComponentName(ReactCurrentOwner.current.type);

      if (name) {
        return "\n\nCheck the render method of `" + name + "`.";
      }
    }

    return "";
  }

  //返回字符串，内容为：检查某个文件下的某一行代码
  function getSourceInfoErrorAddendum(source) {
    if (source !== undefined) {
      // 正则匹配 .开头的可以是n个 后面 紧跟有 \或者/ 多个最少一个
      var fileName = source.fileName.replace(/^.*[\\\/]/, "");
      var lineNumber = source.lineNumber;
      //请检查您的代码
      return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
    }

    return "";
  }

  // 如果属性不为空 则会 检查elementProps.__source 属性值如果还是不为空 则会收集错误信息
  function getSourceInfoErrorAddendumForProps(elementProps) {
    //如果值不等于空
    if (elementProps !== null && elementProps !== undefined) {
      //返回字符串，内容为：检查某个文件下的某一行代码
      return getSourceInfoErrorAddendum(elementProps.__source);
    }

    return "";
  }
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */

  var ownerHasKeyUseWarning = {};
  // 获取当前组件错误信息
  function getCurrentComponentErrorInfo(parentType) {
    // 获取声明错误信息
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName =
        typeof parentType === "string"
          ? parentType
          : parentType.displayName || parentType.name;

      if (parentName) {
        info =
          "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
  /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     * 
     * 

      *如果元素没有显式的键值，则发出警告。
      这个元素在一个数组中。数组可以增长或缩小
      *重新排序。所有未经验证的儿童都被要求进行验证
      *有一个“密钥”属性分配给它。错误状态被缓存，因此会发出警告
      *只显示一次。
      *
      * @internal
      需要一个键的元素。
      * @param {*} parentType元素的父元素类型。
     */

  // 校验组件  组件声明 是不是规范的react vonde
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    // 获取当前组件错误信息
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = "";

    if (
      element &&
      element._owner &&
      element._owner !== ReactCurrentOwner.current
    ) {
      // Give the component that originally created this child.
      //获取组件名称根据 type 返回不同的组件名称
      childOwner =
        " It was passed a child from " +
        getComponentName(element._owner.type) +
        ".";
    }

    // 校验当前dom元素
    setCurrentlyValidatingElement(element);

    {
      //打印出红色错误日志
      warning$1(
        false,
        'Each child in a list should have a unique "key" prop.' +
          "%s%s See https://fb.me/react-warning-keys for more information.",
        currentComponentErrorInfo,
        childOwner
      );
    }

    setCurrentlyValidatingElement(null);
  }
  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */

  // 校验子组件 的react vonde 的kyes 是不规范的
  function validateChildKeys(node, parentType) {
    if (typeof node !== "object") {
      return;
    }

    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        // 检验是否是react vonde
        if (isValidElement(child)) {
          // 校验组件  组件声明 是不是规范的react vonde
          validateExplicitKey(child, parentType);
        }
      }
      // 检验是否是react vonde
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      // 类似于Generator 函数的语法 意思 返回迭代器
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === "function") {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            // 检验是否是react vonde
            if (isValidElement(step.value)) {
              // 校验组件  组件声明 是不是规范的react vonde
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */

  // 给定一个元素，验证它的prop是否符合propTypes定义，
  function validatePropTypes(element) {
    var type = element.type;

    if (type === null || type === undefined || typeof type === "string") {
      return;
    }
    //获取组件名称根据 type 返回不同的组件名称
    var name = getComponentName(type);
    var propTypes;

    if (typeof type === "function") {
      propTypes = type.propTypes;
    } else if (
      typeof type === "object" &&
      (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        type.$$typeof === REACT_MEMO_TYPE)
    ) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // 设置element 检验节点
      setCurrentlyValidatingElement(element);
      // 检测typeSpecs 的 方法 是不是函数 如果不是则发出错误警告
      checkPropTypes_1(
        propTypes,
        element.props,
        "prop",
        name,
        ReactDebugCurrentFrame.getStackAddendum
      );
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      // 打印出红色错误日志
      warningWithoutStack$1(
        false,
        "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
        name || "Unknown"
      );
    }

    if (typeof type.getDefaultProps === "function") {
      !type.getDefaultProps.isReactClassApproved
        ? // 打印出红色错误日志
          warningWithoutStack$1(
            false,
            "getDefaultProps is only used on classic React.createClass " +
              "definitions. Use a static property named `defaultProps` instead."
          )
        : void 0;
    }
  }
  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */

  // 验证Fragment 组件的 Props
  function validateFragmentProps(fragment) {
    // 设置 校验的节点
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== "children" && key !== "key") {
        //打印出红色错误日志
        warning$1(
          false,
          "Invalid prop `%s` supplied to `React.Fragment`. " +
            "React.Fragment can only have `key` and `children` props.",
          key
        );
        break;
      }
    }

    if (fragment.ref !== null) {
      //打印出红色错误日志
      warning$1(false, "Invalid attribute `ref` supplied to `React.Fragment`.");
    }

    setCurrentlyValidatingElement(null);
  }
  // jsx 校验
  function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
    // 判断雷是否是字符串或者方法，或者是对象，或这是react 定义的一些常量
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    // 如果 validType 为假那么则会抛出一些警告
    if (!validType) {
      var info = "";

      if (
        type === undefined ||
        (typeof type === "object" &&
          type !== null &&
          Object.keys(type).length === 0)
      ) {
        info +=
          " You likely forgot to export your component from the file " +
          "it's defined in, or you might have mixed up default and named imports.";
      }
      //返回字符串，内容为：检查某个文件下的某一行代码
      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        // 获取声明错误信息
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = "null";
      } else if (Array.isArray(type)) {
        typeString = "array";
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        //获取组件名称根据 type 返回不同的组件名称
        typeString = "<" + (getComponentName(type.type) || "Unknown") + " />";
        info =
          " Did you accidentally export a JSX literal instead of a component?";
      } else {
        typeString = typeof type;
      }
      //打印出红色错误日志
      warning$1(
        false,
        "React.jsx: type is invalid -- expected a string (for " +
          "built-in components) or a class/function (for composite " +
          "components) but got: %s.%s",
        typeString,
        info
      );
    }
    // 如果使用模拟或自定义函数，则结果可能为空
    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)

    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              // 校验子组件 的react vonde 的kyes 是不规范的
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            //打印出红色错误日志
            warning$1(
              false,
              "React.jsx: Static children should always be an array. " +
                "You are likely explicitly calling React.jsxs or React.jsxDEV. " +
                "Use the Babel transform instead."
            );
          }
        } else {
          // 校验子组件 的react vonde 的kyes 是不规范的
          validateChildKeys(children, type);
        }
      }
    }

    if (hasOwnProperty$2.call(props, "key")) {
      //打印出红色错误日志
      warning$1(
        false,
        "React.jsx: Spreading a key to JSX is a deprecated pattern. " +
          "Explicitly pass a key after spreading props in your JSX call. " +
          "E.g. <ComponentName {...props} key={key} />"
      );
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      // 给定一个元素，验证它的prop是否符合propTypes定义，
      validatePropTypes(element);
    }

    return element;
  }
  // These two functions exist to still get child warnings in dev
  // even with the prod transform. This means that jsxDEV is purely
  // opt-in behavior for better messages but that we won't stop
  // giving you warnings if you use production apis.
  // jsx 校验
  function jsxWithValidationStatic(type, props, key) {
    return jsxWithValidation(type, props, key, true);
  }
  // jsx 校验
  function jsxWithValidationDynamic(type, props, key) {
    return jsxWithValidation(type, props, key, false);
  }

  // 创建react vonde
  function createElementWithValidation(
    type, // 节点类型
    props, // 属性
    children // 子节点
  ) {
    // 判断是否是字符串或者方法，或者是对象，或这是react 定义的一些常量
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    // 如果validType 为空则会发出一些警告
    // console.log("props=", props);
    if (!validType) {
      var info = "";

      if (
        type === undefined ||
        (typeof type === "object" &&
          type !== null &&
          Object.keys(type).length === 0)
      ) {
        info +=
          " You likely forgot to export your component from the file " +
          "it's defined in, or you might have mixed up default and named imports.";
      }
      // 收集props报错信息
      var sourceInfo = getSourceInfoErrorAddendumForProps(props);
      // 累计收集报错信息
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        // 获取声明错误信息
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = "null";
      } else if (Array.isArray(type)) {
        typeString = "array";
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        //获取组件名称根据 type 返回不同的组件名称
        typeString = "<" + (getComponentName(type.type) || "Unknown") + " />";
        // 您是否意外地导出了JSX文本而不是组件?
        info =
          " Did you accidentally export a JSX literal instead of a component?";
      } else {
        typeString = typeof type;
      }
      // 打印出红色错误日志
      warning$1(
        false,
        "React.createElement: type is invalid -- expected a string (for " +
          "built-in components) or a class/function (for composite " +
          "components) but got: %s.%s",
        typeString,
        info
      );
    }

    //如果使用模拟或自定义函数，则结果可能为空。
    var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument. TODO:当这些不再被允许作为类型参数时，删除它。

    if (element == null) {
      return element;
    }
    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    //跳过键警告，如果类型是无效的，因为我们的键验证逻辑
    //不期望使用非字符串/函数类型，可能会抛出令人困惑的错误。
    //我们不希望异常行为在dev和prod之间有所不同。
    //(渲染会抛出一个有用的消息，只要类型是
    //修复，关键警告将出现。)

    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        // 校验子组件 的react vonde 的 kyes 是不规范的
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      // 校验 Fragment 属性是否是规范的
      validateFragmentProps(element);
    } else {
      // 给定一个元素，验证它的prop是否符合propTypes定义，
      validatePropTypes(element);
    }
    // console.log("element======", element);
    return element;
  }
  // 创建验证type 属性
  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type; // Legacy hook: remove it

    {
      Object.defineProperty(validatedFactory, "type", {
        enumerable: false,
        get: function () {
          //打印警告日志
          lowPriorityWarningWithoutStack$1(
            false,
            "Factory.type is deprecated. Access the class directly " +
              "before passing it to createFactory."
          );
          Object.defineProperty(this, "type", {
            value: type,
          });
          return type;
        },
      });
    }

    return validatedFactory;
  }
  // 创建克隆节点，并且带有验证
  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);

    for (var i = 2; i < arguments.length; i++) {
      // 校验子组件 的react vonde 的kyes 是不规范的
      validateChildKeys(arguments[i], newElement.type);
    }
    // 给定一个元素，验证它的prop是否符合propTypes定义，
    validatePropTypes(newElement);
    return newElement;
  }

  var enableSchedulerDebugging = false;
  var enableIsInputPending = false;
  var enableProfiling = true;

  var requestHostCallback;

  var requestHostTimeout;
  var cancelHostTimeout;
  var shouldYieldToHost;
  var requestPaint;
  var getCurrentTime;
  var forceFrameRate;

  if (
    // If Scheduler runs in a non-DOM environment, it falls back to a naive
    // implementation using setTimeout.
    //如果调度器在非dom环境中运行，它会返回到naive
    //使用setTimeout实现。
    typeof window === "undefined" ||
    // Check if MessageChannel is supported, too. //检查是否也支持MessageChannel。
    typeof MessageChannel !== "function"
  ) {
    // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
    // fallback to a naive implementation.
    //如果不小心在非浏览器环境中导入，例如:JavaScriptCore，
    //退回到一个简单的实现。
    var _callback = null;
    var _timeoutID = null;

    var _flushCallback = function () {
      if (_callback !== null) {
        // 如果回调函数 存在
        try {
          var currentTime = getCurrentTime(); //获取当前时间，其实就是现在时间减去上一次时间
          var hasRemainingTime = true; //
          // 回调方法
          _callback(hasRemainingTime, currentTime);

          _callback = null;
        } catch (e) {
          // 如果上面发成错误 在异步回调
          setTimeout(_flushCallback, 0);
          throw e;
        }
      }
    };
    // 初始化时间
    var initialTime = Date.now();
    // 获取时间戳
    getCurrentTime = function () {
      return Date.now() - initialTime;
    };
    // 执行回调函数 cb
    requestHostCallback = function (cb) {
      if (_callback !== null) {
        // Protect against re-entrancy.  第三个是参数 附加参数，一旦定时器到期，它们会作为参数传递给function
        setTimeout(requestHostCallback, 0, cb);
      } else {
        _callback = cb;
        setTimeout(_flushCallback, 0);
      }
    };
    // 异步执行回调函数
    requestHostTimeout = function (cb, ms) {
      _timeoutID = setTimeout(cb, ms);
    };
    // 清除定时器
    cancelHostTimeout = function () {
      clearTimeout(_timeoutID);
    };
    // 返回状态false
    shouldYieldToHost = function () {
      return false;
    };

    requestPaint = forceFrameRate = function () {};
  } else {
    // Capture local references to native APIs, in case a polyfill overrides them.
    // 在浏览器环境中
    // 浏览器新能监控api
    var performance = window.performance;
    // 时间对象
    var _Date = window.Date;
    // 定时器函数
    var _setTimeout = window.setTimeout;
    // 清除定时器函数
    var _clearTimeout = window.clearTimeout;
    // 如果可以输出日志console
    if (typeof console !== "undefined") {
      // TODO: Scheduler no longer requires these methods to be polyfilled. But
      // maybe we want to continue warning if they don't exist, to preserve the
      // option to rely on it in the future?
      // TODO: Scheduler不再需要对这些方法进行填充。但
      //如果他们不存在，也许我们应该继续警告他们，保护他们
      //选择将来依靠它?
      /*
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，
并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
该方法需要传入一个回调函数作为参数，
该回调函数会在浏览器下一次重绘之前执行


*/

      var requestAnimationFrame = window.requestAnimationFrame;
      // 清除 这个动画帧
      var cancelAnimationFrame = window.cancelAnimationFrame; // TODO: Remove fb.me link
      // 如果requestAnimationFrame 不支持这个api 就报错
      if (typeof requestAnimationFrame !== "function") {
        console.error(
          "This browser doesn't support requestAnimationFrame. " +
            "Make sure that you load a " +
            "polyfill in older browsers. https://fb.me/react-polyfills"
        );
      }
      // 如果cancelAnimationFrame 不支持这个api 就报错
      if (typeof cancelAnimationFrame !== "function") {
        console.error(
          "This browser doesn't support cancelAnimationFrame. " +
            "Make sure that you load a " +
            "polyfill in older browsers. https://fb.me/react-polyfills"
        );
      }
    }

    if (
      typeof performance === "object" &&
      typeof performance.now === "function"
    ) {
      getCurrentTime = function () {
        // 获取当前时间
        return performance.now();
      };
    } else {
      var _initialTime = _Date.now();
      // 获取 相隔时间
      getCurrentTime = function () {
        return _Date.now() - _initialTime;
      };
    }

    var isMessageLoopRunning = false;
    var scheduledHostCallback = null;
    var taskTimeoutID = -1;
    // Scheduler periodically yields in case there is other work on the main
    // thread, like user events. By default, it yields multiple times per frame.
    // It does not attempt to align with frame boundaries, since most tasks don't
    // need to be frame aligned; for those that do, use requestAnimationFrame.
    //如果主机上有其他工作，调度器就会周期性地产生
    //线程，比如用户事件。默认情况下，它每帧会生成多次。
    //它不尝试与框架边界对齐，因为大多数任务都不这样做
    //需要帧对齐;对于那些这样做的，使用requestAnimationFrame。

    var yieldInterval = 5;
    var deadline = 0;
    // TODO: Make this configurable
    // TODO: Adjust this based on priority?
    // TODO:使其可配置
    // TODO:根据优先级调整?

    var maxYieldInterval = 300;
    var needsPaint = false;

    if (
      enableIsInputPending &&
      navigator !== undefined &&
      navigator.scheduling !== undefined &&
      navigator.scheduling.isInputPending !== undefined
    ) {
      /*
                
                navigator 浏览器 信息
                */
      var scheduling = navigator.scheduling;

      shouldYieldToHost = function () {
        var currentTime = getCurrentTime();

        if (currentTime >= deadline) {
          // There's no time left. We may want to yield control of the main
          // thread, so the browser can perform high priority tasks. The main ones
          // are painting and user input. If there's a pending paint or a pending
          // input, then we should yield. But if there's neither, then we can
          // yield less often while remaining responsive. We'll eventually yield
          // regardless, since there could be a pending paint that wasn't
          // accompanied by a call to `requestPaint`, or other main thread tasks
          // like network events.
          //没有时间了。我们可能想要放弃主要的控制权
          //线程，这样浏览器就可以执行高优先级的任务。主要的
          //是绘画和用户输入。如果有一个待定的油漆或待定
          //投入，那么我们应该让步。但如果两者都没有，我们就可以
          //在保持响应的同时减少产量。我们最终会屈服
          //不管怎样，因为可能会有一种未完成的油漆
          //同时调用“requestPaint”或其他主线程任务
          //喜欢网络活动。
          if (needsPaint || scheduling.isInputPending()) {
            // There is either a pending paint or a pending input.
            // 有一个悬而未决的问题 或者在输入
            return true;
          }
          // There's no pending input. Only yield if we've reached the max
          // yield interval.
          //没有等待输入。只有当我们达到最大值时才会屈服
          //收益率区间。

          return currentTime >= maxYieldInterval;
        } else {
          // There's still time left in the frame.
          //画面里还有时间。
          return false;
        }
      };

      requestPaint = function () {
        needsPaint = true;
      };
    } else {
      // `isInputPending` is not available. Since we have no way of knowing if
      // there's pending input, always yield at the end of the frame.
      // ' isInputPending '不可用。因为我们无法知道
      //有待定的输入，总是在帧的末尾产生。
      shouldYieldToHost = function () {
        return getCurrentTime() >= deadline;
      }; // Since we yield every frame regardless, `requestPaint` has no effect.

      requestPaint = function () {};
    }

    //fps不能小于0，不能大于125帧/秒 否则发出错误警告
    forceFrameRate = function (fps) {
      if (fps < 0 || fps > 125) {
        console.error(
          "forceFrameRate takes a positive int between 0 and 125, " +
            "forcing framerates higher than 125 fps is not unsupported"
        );
        return;
      }

      if (fps > 0) {
        // 1000/fps   就是 例如fps=10，每帧100ms  这里就计算就是每秒一帧
        yieldInterval = Math.floor(1000 / fps);
      } else {
        //重置帧率
        // reset the framerate
        yieldInterval = 5;
      }
    };
    // 执行回调函数
    var performWorkUntilDeadline = function () {
      if (scheduledHostCallback !== null) {
        // 获取当前时间
        var currentTime = getCurrentTime();
        // Yield after `yieldInterval` ms, regardless of where we are in the vsync
        // cycle. This means there's always time remaining at the beginning of
        // the message event.
        // Yield在“yieldInterval”ms之后，不管我们在vsync的什么位置
        //循环。这意味着在开始的时候总还有时间
        //消息事件。
        // 帧频加当前时间
        deadline = currentTime + yieldInterval;
        var hasTimeRemaining = true;

        try {
          // 看看有没有更多的工作，执行回调函数
          var hasMoreWork = scheduledHostCallback(
            hasTimeRemaining,
            currentTime
          );

          if (!hasMoreWork) {
            isMessageLoopRunning = false;
            scheduledHostCallback = null;
          } else {
            // If there's more work, schedule the next message event at the end
            // of the preceding one.
            //如果有更多的工作，请将下一个消息事件安排在前一个事件的末尾。

            port.postMessage(null);
          }
        } catch (error) {
          // If a scheduler task throws, exit the current browser task so the
          // error can be observed.
          //如果调度程序任务抛出，则退出当前浏览器任务，以便可以观察错误。
          port.postMessage(null);
          throw error;
        }
      } else {
        // 重置
        isMessageLoopRunning = false;
      }
      // Yielding to the browser will give it a chance to paint, so we can
      // reset this.

      needsPaint = false;
    };
    //MessageChannel创建的新通道
    var channel = new MessageChannel();
    var port = channel.port2;
    // 接受信息
    channel.port1.onmessage = performWorkUntilDeadline;
    // 请求回调函数 并且执行回调函数
    requestHostCallback = function (callback) {
      scheduledHostCallback = callback;

      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        // 推送信息
        port.postMessage(null);
      }
    };
    // 请求时间
    requestHostTimeout = function (callback, ms) {
      taskTimeoutID = _setTimeout(function () {
        callback(getCurrentTime());
      }, ms);
    };
    // 清除定时器
    cancelHostTimeout = function () {
      _clearTimeout(taskTimeoutID);

      taskTimeoutID = -1;
    };
  }

  // 把一个node 添加到一个队列中
  function push(heap, node) {
    var index = heap.length;
    heap.push(node);
    // console.log("siftUp");
    siftUp(heap, node, index);
  }

  function peek(heap) {
    var first = heap[0];
    return first === undefined ? null : first;
  }

  function pop(heap) {
    var first = heap[0];

    if (first !== undefined) {
      var last = heap.pop();

      if (last !== first) {
        heap[0] = last;
        siftDown(heap, last, 0);
      }

      return first;
    } else {
      return null;
    }
  }

  function siftUp(heap, node, i) {
    var index = i;

    while (true) {
      var parentIndex = Math.floor((index - 1) / 2);
      // console.log("parentIndex=", parentIndex);
      var parent = heap[parentIndex];
      // 比较a和a中的sortIndex 如果是不相等则返回diff，否则返回 a.id-b.id
      if (parent !== undefined && compare(parent, node) > 0) {
        // The parent is larger. Swap positions.
        heap[parentIndex] = node;
        heap[index] = parent;
        index = parentIndex;
      } else {
        // The parent is smaller. Exit.
        return;
      }
    }
  }

  function siftDown(heap, node, i) {
    var index = i;
    var length = heap.length;

    while (index < length) {
      var leftIndex = (index + 1) * 2 - 1;
      var left = heap[leftIndex];
      var rightIndex = leftIndex + 1;
      //如果左边或右边的节点比较小，则与其中较小的节点交换。
      var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

      if (
        left !== undefined &&
        // 比较a和a中的sortIndex 如果是不相等则返回diff，否则返回 a.id-b.id
        compare(left, node) < 0
      ) {
        if (
          right !== undefined &&
          // 比较a和a中的sortIndex 如果是不相等则返回diff，否则返回 a.id-b.id
          compare(right, left) < 0
        ) {
          heap[index] = right;
          heap[rightIndex] = node;
          index = rightIndex;
        } else {
          heap[index] = left;
          heap[leftIndex] = node;
          index = leftIndex;
        }
      } else if (
        right !== undefined &&
        // 比较a和a中的sortIndex 如果是不相等则返回diff，否则返回 a.id-b.id
        compare(right, node) < 0
      ) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        //两个孩子都不小。退出
        // Neither child is smaller. Exit.
        return;
      }
    }
  }
  // 比较a和a中的sortIndex 如果是不相等则返回diff，否则返回 a.id-b.id
  function compare(a, b) {
    // Compare sort index first, then task id. 首先比较排序索引，然后是任务id。
    //
    var diff = a.sortIndex - b.sortIndex;
    return diff !== 0 ? diff : a.id - b.id;
  }

  // TODO: Use symbols?
  var NoPriority = 0;
  var ImmediatePriority = 1; //立即执行 - 最高优先级 ImmediatePriority
  var UserBlockingPriority = 2;
  var NormalPriority = 3; //  开始优先级是3
  var LowPriority = 4;
  var IdlePriority = 5;

  var runIdCounter = 0;
  var mainThreadIdCounter = 0;
  var profilingStateSize = 4;
  var sharedProfilingBuffer = enableProfiling // $FlowFixMe Flow doesn't know about SharedArrayBuffer
    ? typeof SharedArrayBuffer === "function"
      ? new SharedArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT) // $FlowFixMe Flow doesn't know about ArrayBuffer
      : typeof ArrayBuffer === "function"
      ? new ArrayBuffer(profilingStateSize * Int32Array.BYTES_PER_ELEMENT)
      : null // Don't crash the init path on IE9
    : null;
  var profilingState =
    enableProfiling && sharedProfilingBuffer !== null
      ? new Int32Array(sharedProfilingBuffer)
      : []; // We can't read this but it helps save bytes for null checks

  var PRIORITY = 0;
  var CURRENT_TASK_ID = 1;
  var CURRENT_RUN_ID = 2;
  var QUEUE_SIZE = 3;

  if (enableProfiling) {
    profilingState[PRIORITY] = NoPriority; // This is maintained with a counter, because the size of the priority queue
    // array might include canceled tasks.

    profilingState[QUEUE_SIZE] = 0;
    profilingState[CURRENT_TASK_ID] = 0;
  } // Bytes per element is 4

  var INITIAL_EVENT_LOG_SIZE = 131072;
  var MAX_EVENT_LOG_SIZE = 524288; // Equivalent to 2 megabytes

  var eventLogSize = 0;
  var eventLogBuffer = null;
  var eventLog = null;
  var eventLogIndex = 0;
  var TaskStartEvent = 1;
  var TaskCompleteEvent = 2;
  var TaskErrorEvent = 3;
  var TaskCancelEvent = 4;
  var TaskRunEvent = 5;
  var TaskYieldEvent = 6;
  var SchedulerSuspendEvent = 7;
  var SchedulerResumeEvent = 8;

  function logEvent(entries) {
    if (eventLog !== null) {
      var offset = eventLogIndex;
      eventLogIndex += entries.length;

      if (eventLogIndex + 1 > eventLogSize) {
        eventLogSize *= 2;

        if (eventLogSize > MAX_EVENT_LOG_SIZE) {
          console.error(
            "Scheduler Profiling: Event log exceeded maximum size. Don't " +
              "forget to call `stopLoggingProfilingEvents()`."
          );
          stopLoggingProfilingEvents();
          return;
        }

        var newEventLog = new Int32Array(eventLogSize * 4);
        newEventLog.set(eventLog);
        eventLogBuffer = newEventLog.buffer;
        eventLog = newEventLog;
      }

      eventLog.set(entries, offset);
    }
  }

  function startLoggingProfilingEvents() {
    eventLogSize = INITIAL_EVENT_LOG_SIZE;
    eventLogBuffer = new ArrayBuffer(eventLogSize * 4);
    eventLog = new Int32Array(eventLogBuffer);
    eventLogIndex = 0;
  }

  function stopLoggingProfilingEvents() {
    var buffer = eventLogBuffer;
    eventLogSize = 0;
    eventLogBuffer = null;
    eventLog = null;
    eventLogIndex = 0;
    return buffer;
  }

  function markTaskStart(task, ms) {
    if (enableProfiling) {
      profilingState[QUEUE_SIZE]++;

      if (eventLog !== null) {
        // performance.now returns a float, representing milliseconds. When the
        // event is logged, it's coerced to an int. Convert to microseconds to
        // maintain extra degrees of precision.
        logEvent([TaskStartEvent, ms * 1000, task.id, task.priorityLevel]);
      }
    }
  }

  function markTaskCompleted(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskCompleteEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskCanceled(task, ms) {
    if (enableProfiling) {
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskCancelEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskErrored(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[QUEUE_SIZE]--;

      if (eventLog !== null) {
        logEvent([TaskErrorEvent, ms * 1000, task.id]);
      }
    }
  }

  function markTaskRun(task, ms) {
    if (enableProfiling) {
      runIdCounter++;
      profilingState[PRIORITY] = task.priorityLevel;
      profilingState[CURRENT_TASK_ID] = task.id;
      profilingState[CURRENT_RUN_ID] = runIdCounter;

      if (eventLog !== null) {
        logEvent([TaskRunEvent, ms * 1000, task.id, runIdCounter]);
      }
    }
  }

  function markTaskYield(task, ms) {
    if (enableProfiling) {
      profilingState[PRIORITY] = NoPriority;
      profilingState[CURRENT_TASK_ID] = 0;
      profilingState[CURRENT_RUN_ID] = 0;

      if (eventLog !== null) {
        logEvent([TaskYieldEvent, ms * 1000, task.id, runIdCounter]);
      }
    }
  }

  function markSchedulerSuspended(ms) {
    if (enableProfiling) {
      mainThreadIdCounter++;

      if (eventLog !== null) {
        logEvent([SchedulerSuspendEvent, ms * 1000, mainThreadIdCounter]);
      }
    }
  }

  function markSchedulerUnsuspended(ms) {
    if (enableProfiling) {
      if (eventLog !== null) {
        logEvent([SchedulerResumeEvent, ms * 1000, mainThreadIdCounter]);
      }
    }
  }

  /* eslint-disable no-var */
  // Math.pow(2, 30) - 1
  // 0b111111111111111111111111111111

  var maxSigned31BitInt = 1073741823; // Times out immediately

  var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5000;
  var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

  var IDLE_PRIORITY = maxSigned31BitInt; // Tasks are stored on a min heap

  var taskQueue = [];
  var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

  var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.

  var isSchedulerPaused = false;
  var currentTask = null;
  var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy. 这是在执行工作时设置的，以防止重入。

  var isPerformingWork = false;
  var isHostCallbackScheduled = false;
  var isHostTimeoutScheduled = false;

  function advanceTimers(currentTime) {
    // Check for tasks that are no longer delayed and add them to the queue.
    var timer = peek(timerQueue);

    while (timer !== null) {
      if (timer.callback === null) {
        // Timer was cancelled.
        pop(timerQueue);
      } else if (timer.startTime <= currentTime) {
        // Timer fired. Transfer to the task queue.
        pop(timerQueue);
        timer.sortIndex = timer.expirationTime;
        push(taskQueue, timer);

        if (enableProfiling) {
          markTaskStart(timer, currentTime);
          timer.isQueued = true;
        }
      } else {
        // Remaining timers are pending.
        return;
      }

      timer = peek(timerQueue);
    }
  }

  function handleTimeout(currentTime) {
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);

    if (!isHostCallbackScheduled) {
      if (peek(taskQueue) !== null) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      } else {
        var firstTimer = peek(timerQueue);

        if (firstTimer !== null) {
          requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
      }
    }
  }

  function flushWork(hasTimeRemaining, initialTime) {
    if (enableProfiling) {
      markSchedulerUnsuspended(initialTime);
    } // We'll need a host callback the next time work is scheduled.

    isHostCallbackScheduled = false;

    if (isHostTimeoutScheduled) {
      // We scheduled a timeout but it's no longer needed. Cancel it.
      isHostTimeoutScheduled = false;
      cancelHostTimeout();
    }

    isPerformingWork = true;
    var previousPriorityLevel = currentPriorityLevel;

    try {
      if (enableProfiling) {
        try {
          return workLoop(hasTimeRemaining, initialTime);
        } catch (error) {
          if (currentTask !== null) {
            var currentTime = getCurrentTime();
            markTaskErrored(currentTask, currentTime);
            currentTask.isQueued = false;
          }

          throw error;
        }
      } else {
        // No catch in prod codepath.
        return workLoop(hasTimeRemaining, initialTime);
      }
    } finally {
      currentTask = null;
      currentPriorityLevel = previousPriorityLevel;
      isPerformingWork = false;

      if (enableProfiling) {
        var _currentTime = getCurrentTime();

        markSchedulerSuspended(_currentTime);
      }
    }
  }

  function workLoop(hasTimeRemaining, initialTime) {
    var currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek(taskQueue);

    while (
      currentTask !== null &&
      !(enableSchedulerDebugging && isSchedulerPaused)
    ) {
      if (
        currentTask.expirationTime > currentTime &&
        (!hasTimeRemaining || shouldYieldToHost())
      ) {
        // This currentTask hasn't expired, and we've reached the deadline.
        break;
      }

      var callback = currentTask.callback;

      if (callback !== null) {
        currentTask.callback = null;
        currentPriorityLevel = currentTask.priorityLevel;
        var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
        markTaskRun(currentTask, currentTime);
        var continuationCallback = callback(didUserCallbackTimeout);
        currentTime = getCurrentTime();

        if (typeof continuationCallback === "function") {
          currentTask.callback = continuationCallback;
          markTaskYield(currentTask, currentTime);
        } else {
          if (enableProfiling) {
            markTaskCompleted(currentTask, currentTime);
            currentTask.isQueued = false;
          }

          if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
          }
        }

        advanceTimers(currentTime);
      } else {
        pop(taskQueue);
      }

      currentTask = peek(taskQueue);
    } // Return whether there's additional work

    if (currentTask !== null) {
      return true;
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }

      return false;
    }
  }

  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority: //立即执行 - 最高优先级 ImmediatePriority
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;

      default:
        priorityLevel = NormalPriority;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_next(eventHandler) {
    var priorityLevel;

    switch (currentPriorityLevel) {
      case ImmediatePriority: //立即执行 - 最高优先级 ImmediatePriority
      case UserBlockingPriority:
      case NormalPriority:
        // Shift down to normal priority
        priorityLevel = NormalPriority;
        break;

      default:
        // Anything lower than normal priority should remain at the current level.
        priorityLevel = currentPriorityLevel;
        break;
    }

    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = priorityLevel;

    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  }

  function unstable_wrapCallback(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function () {
      // This is a fork of runWithPriority, inlined for performance.
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = parentPriorityLevel;

      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
  }

  function timeoutForPriorityLevel(priorityLevel) {
    switch (priorityLevel) {
      case ImmediatePriority: //立即执行 - 最高优先级 ImmediatePriority
        return IMMEDIATE_PRIORITY_TIMEOUT;

      case UserBlockingPriority:
        return USER_BLOCKING_PRIORITY;

      case IdlePriority:
        return IDLE_PRIORITY;

      case LowPriority:
        return LOW_PRIORITY_TIMEOUT;

      case NormalPriority:
      default:
        return NORMAL_PRIORITY_TIMEOUT;
    }
  }

  function unstable_scheduleCallback(priorityLevel, callback, options) {
    var currentTime = getCurrentTime();
    var startTime;
    var timeout;

    if (typeof options === "object" && options !== null) {
      var delay = options.delay;

      if (typeof delay === "number" && delay > 0) {
        startTime = currentTime + delay;
      } else {
        startTime = currentTime;
      }

      timeout =
        typeof options.timeout === "number"
          ? options.timeout
          : timeoutForPriorityLevel(priorityLevel);
    } else {
      timeout = timeoutForPriorityLevel(priorityLevel);
      startTime = currentTime;
    }

    var expirationTime = startTime + timeout;
    var newTask = {
      id: taskIdCounter++,
      callback: callback,
      priorityLevel: priorityLevel,
      startTime: startTime,
      expirationTime: expirationTime,
      sortIndex: -1,
    };

    if (enableProfiling) {
      newTask.isQueued = false;
    }

    if (startTime > currentTime) {
      // This is a delayed task.
      newTask.sortIndex = startTime;
      push(timerQueue, newTask);

      if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
        // All tasks are delayed, and this is the task with the earliest delay.
        if (isHostTimeoutScheduled) {
          // Cancel an existing timeout.
          cancelHostTimeout();
        } else {
          isHostTimeoutScheduled = true;
        } // Schedule a timeout.

        requestHostTimeout(handleTimeout, startTime - currentTime);
      }
    } else {
      newTask.sortIndex = expirationTime;
      push(taskQueue, newTask);

      if (enableProfiling) {
        markTaskStart(newTask, currentTime);
        newTask.isQueued = true;
      } // Schedule a host callback, if needed. If we're already performing work,
      // wait until the next time we yield.

      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true;
        requestHostCallback(flushWork);
      }
    }

    return newTask;
  }

  function unstable_pauseExecution() {
    isSchedulerPaused = true;
  }

  function unstable_continueExecution() {
    isSchedulerPaused = false;

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  function unstable_getFirstCallbackNode() {
    return peek(taskQueue);
  }

  function unstable_cancelCallback(task) {
    if (enableProfiling) {
      if (task.isQueued) {
        var currentTime = getCurrentTime();
        markTaskCanceled(task, currentTime);
        task.isQueued = false;
      }
    } // Null out the callback to indicate the task has been canceled. (Can't
    // remove from the queue because you can't remove arbitrary nodes from an
    // array based heap, only the first one.)

    task.callback = null;
  }

  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }

  function unstable_shouldYield() {
    var currentTime = getCurrentTime();
    advanceTimers(currentTime);
    var firstTask = peek(taskQueue);
    return (
      (firstTask !== currentTask &&
        currentTask !== null &&
        firstTask !== null &&
        firstTask.callback !== null &&
        firstTask.startTime <= currentTime &&
        firstTask.expirationTime < currentTask.expirationTime) ||
      shouldYieldToHost()
    );
  }

  var unstable_requestPaint = requestPaint;
  var unstable_Profiling = enableProfiling
    ? {
        startLoggingProfilingEvents: startLoggingProfilingEvents,
        stopLoggingProfilingEvents: stopLoggingProfilingEvents,
        sharedProfilingBuffer: sharedProfilingBuffer,
      }
    : null;

  /*
    
    暴露接口 出来 给 react-dom  js中引用
     _ReactInternals$Sched 在 react-dom 中就是 _ReactInternals$Sched
     这样引用到该方法
    var unstable_UserBlockingPriority =
     _ReactInternals$Sched.unstable_UserBlockingPriority;   // 2 
    
    */

  var Scheduler = Object.freeze({
    unstable_ImmediatePriority: ImmediatePriority, // 1//立即执行 - 最高优先级 ImmediatePriority
    unstable_UserBlockingPriority: UserBlockingPriority, // 2
    unstable_NormalPriority: NormalPriority, // 3
    unstable_IdlePriority: IdlePriority, //5
    unstable_LowPriority: LowPriority, // 4
    unstable_runWithPriority: unstable_runWithPriority,
    unstable_next: unstable_next,
    unstable_scheduleCallback: unstable_scheduleCallback,
    unstable_cancelCallback: unstable_cancelCallback,
    unstable_wrapCallback: unstable_wrapCallback,
    unstable_getCurrentPriorityLevel: unstable_getCurrentPriorityLevel,
    unstable_shouldYield: unstable_shouldYield,
    unstable_requestPaint: unstable_requestPaint,
    unstable_continueExecution: unstable_continueExecution,
    unstable_pauseExecution: unstable_pauseExecution,
    unstable_getFirstCallbackNode: unstable_getFirstCallbackNode,
    get unstable_now() {
      return getCurrentTime;
    },
    get unstable_forceFrameRate() {
      return forceFrameRate;
    },
    unstable_Profiling: unstable_Profiling,
  });

  // Helps identify side effects in render-phase lifecycle hooks and setState
  // reducers by double invoking them in Strict Mode.

  // To preserve the "Pause on caught exceptions" behavior of the // , we
  // replay the begin phase of a failed component inside invokeGuardedCallback.

  // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:

  // Gather advanced timing metrics for Profiler subtrees.

  // Trace which interactions trigger each commit.

  var enableSchedulerTracing = true; // SSR experiments

  // Only used in www builds.

  // Only used in www builds.

  // Disable javascript: URL strings in href for XSS protection.

  // React Fire: prevent the value and checked attributes from syncing
  // with their related DOM properties

  // These APIs will no longer be "unstable" in the upcoming 16.7 release,
  // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.

  var exposeConcurrentModeAPIs = false;
  // Experimental React Flare event system and event components support.

  var enableFlareAPI = false; // Experimental Host Component support.

  var enableFundamentalAPI = false; // Experimental Scope support.

  var enableScopeAPI = false; // New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107

  var enableJSXTransformAPI = false; // We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
  // Till then, we warn about the missing mock, but still fallback to a legacy mode compatible version

  // For tests, we flush suspense fallbacks in an act scope;
  // *except* in some of our own tests, where we test incremental loading states.

  // Add a callback property to suspense to notify which promises are currently
  // in the update queue. This allows reporting and tracing of what is causing
  // the user to see a loading state.
  // Also allows hydration callbacks to fire when a dehydrated boundary gets
  // hydrated or deleted.

  // Part of the simplification of React.createElement so we can eventually move
  // from React.createElement to React.jsx
  // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

  // Flag to turn event.target and event.currentTarget in ReactNative from a reactTag to a component instance

  var DEFAULT_THREAD_ID = 0; // Counters used to generate unique IDs.

  var interactionIDCounter = 0;
  var threadIDCounter = 0; // Set of currently traced interactions.
  // Interactions "stack"–
  // Meaning that newly traced interactions are appended to the previously active set.
  // When an interaction goes out of scope, the previous set (if any) is restored.

  var interactionsRef = null; // Listener(s) to notify when interactions begin and end.

  var subscriberRef = null;

  if (enableSchedulerTracing) {
    interactionsRef = {
      current: new Set(),
    };
    subscriberRef = {
      current: null,
    };
  }

  function unstable_clear(callback) {
    if (!enableSchedulerTracing) {
      return callback();
    }

    var prevInteractions = interactionsRef.current;
    interactionsRef.current = new Set();

    try {
      return callback();
    } finally {
      interactionsRef.current = prevInteractions;
    }
  }

  function unstable_getCurrent() {
    if (!enableSchedulerTracing) {
      return null;
    } else {
      return interactionsRef.current;
    }
  }

  function unstable_getThreadID() {
    return ++threadIDCounter;
  }

  function unstable_trace(name, timestamp, callback) {
    var threadID =
      arguments.length > 3 && arguments[3] !== undefined
        ? arguments[3]
        : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback();
    }

    var interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name: name,
      timestamp: timestamp,
    };
    var prevInteractions = interactionsRef.current; // Traced interactions should stack/accumulate.
    // To do that, clone the current interactions.
    // The previous set will be restored upon completion.

    var interactions = new Set(prevInteractions);
    interactions.add(interaction);
    interactionsRef.current = interactions;
    var subscriber = subscriberRef.current;
    var returnValue;

    try {
      if (subscriber !== null) {
        subscriber.onInteractionTraced(interaction);
      }
    } finally {
      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(interactions, threadID);
        }
      } finally {
        try {
          returnValue = callback();
        } finally {
          interactionsRef.current = prevInteractions;

          try {
            if (subscriber !== null) {
              subscriber.onWorkStopped(interactions, threadID);
            }
          } finally {
            interaction.__count--; // If no async work was scheduled for this interaction,
            // Notify subscribers that it's completed.

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          }
        }
      }
    }

    return returnValue;
  }

  function unstable_wrap(callback) {
    var threadID =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : DEFAULT_THREAD_ID;

    if (!enableSchedulerTracing) {
      return callback;
    }

    var wrappedInteractions = interactionsRef.current;
    var subscriber = subscriberRef.current;

    if (subscriber !== null) {
      subscriber.onWorkScheduled(wrappedInteractions, threadID);
    } // Update the pending async work count for the current interactions.
    // Update after calling subscribers in case of error.

    wrappedInteractions.forEach(function (interaction) {
      interaction.__count++;
    });
    var hasRun = false;

    function wrapped() {
      var prevInteractions = interactionsRef.current;
      interactionsRef.current = wrappedInteractions;
      subscriber = subscriberRef.current;

      try {
        var returnValue;

        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(wrappedInteractions, threadID);
          }
        } finally {
          try {
            returnValue = callback.apply(undefined, arguments);
          } finally {
            interactionsRef.current = prevInteractions;

            if (subscriber !== null) {
              subscriber.onWorkStopped(wrappedInteractions, threadID);
            }
          }
        }

        return returnValue;
      } finally {
        if (!hasRun) {
          // We only expect a wrapped function to be executed once,
          // But in the event that it's executed more than once–
          // Only decrement the outstanding interaction counts once.
          hasRun = true; // Update pending async counts for all wrapped interactions.
          // If this was the last scheduled async work for any of them,
          // Mark them as completed.

          wrappedInteractions.forEach(function (interaction) {
            interaction.__count--;

            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }
    }

    wrapped.cancel = function cancel() {
      subscriber = subscriberRef.current;

      try {
        if (subscriber !== null) {
          subscriber.onWorkCanceled(wrappedInteractions, threadID);
        }
      } finally {
        // Update pending async counts for all wrapped interactions.
        // If this was the last scheduled async work for any of them,
        // Mark them as completed.
        wrappedInteractions.forEach(function (interaction) {
          interaction.__count--;

          if (subscriber && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    };

    return wrapped;
  }

  var subscribers = null;

  if (enableSchedulerTracing) {
    subscribers = new Set();
  }

  function unstable_subscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.add(subscriber);

      if (subscribers.size === 1) {
        subscriberRef.current = {
          onInteractionScheduledWorkCompleted:
            onInteractionScheduledWorkCompleted,
          onInteractionTraced: onInteractionTraced,
          onWorkCanceled: onWorkCanceled,
          onWorkScheduled: onWorkScheduled,
          onWorkStarted: onWorkStarted,
          onWorkStopped: onWorkStopped,
        };
      }
    }
  }

  function unstable_unsubscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        subscriberRef.current = null;
      }
    }
  }

  function onInteractionTraced(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionTraced(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onInteractionScheduledWorkCompleted(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onInteractionScheduledWorkCompleted(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkScheduled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkScheduled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStarted(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkStopped(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkStopped(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  function onWorkCanceled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function (subscriber) {
      try {
        subscriber.onWorkCanceled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });

    if (didCatchError) {
      throw caughtError;
    }
  }

  var SchedulerTracing = Object.freeze({
    get __interactionsRef() {
      return interactionsRef;
    },
    get __subscriberRef() {
      return subscriberRef;
    },
    unstable_clear: unstable_clear,
    unstable_getCurrent: unstable_getCurrent,
    unstable_getThreadID: unstable_getThreadID,
    unstable_trace: unstable_trace,
    unstable_wrap: unstable_wrap,
    unstable_subscribe: unstable_subscribe,
    unstable_unsubscribe: unstable_unsubscribe,
  });

  var ReactSharedInternals$2 = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    IsSomeRendererActing: IsSomeRendererActing,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign,
  };

  {
    objectAssign(ReactSharedInternals$2, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {},
    });
  } // Re-export the schedule API(s) for UMD bundles.
  // This avoids introducing a dependency on a new UMD global in a minor update,
  // Since that would be a breaking change (e.g. for all existing CodeSandboxes).
  // This re-export is only required for UMD bundles;
  // CJS bundles use the shared NPM package.

  objectAssign(ReactSharedInternals$2, {
    Scheduler: Scheduler,
    SchedulerTracing: SchedulerTracing,
  });

  var hasBadMapPolyfill;

  {
    hasBadMapPolyfill = false;

    try {
      var frozenObject = Object.freeze({});
      var testMap = new Map([[frozenObject, null]]);
      var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
      // https://github.com/rollup/rollup/issues/1771
      // TODO: we can remove these if Rollup fixes the bug.

      testMap.set(0, 0);
      testSet.add(0);
    } catch (e) {
      // TODO: Consider warning about bad polyfills
      hasBadMapPolyfill = true;
    }
  }

  function createFundamentalComponent(impl) {
    // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.
    if (true && !hasBadMapPolyfill) {
      Object.freeze(impl);
    }

    var fundamantalComponent = {
      $$typeof: REACT_FUNDAMENTAL_TYPE,
      impl: impl,
    };

    {
      Object.freeze(fundamantalComponent);
    }

    return fundamantalComponent;
  }

  function createEventResponder(displayName, responderConfig) {
    var getInitialState = responderConfig.getInitialState,
      onEvent = responderConfig.onEvent,
      onMount = responderConfig.onMount,
      onUnmount = responderConfig.onUnmount,
      onRootEvent = responderConfig.onRootEvent,
      rootEventTypes = responderConfig.rootEventTypes,
      targetEventTypes = responderConfig.targetEventTypes,
      targetPortalPropagation = responderConfig.targetPortalPropagation;
    var eventResponder = {
      $$typeof: REACT_RESPONDER_TYPE,
      displayName: displayName,
      getInitialState: getInitialState || null,
      onEvent: onEvent || null,
      onMount: onMount || null,
      onRootEvent: onRootEvent || null,
      onUnmount: onUnmount || null,
      rootEventTypes: rootEventTypes || null,
      targetEventTypes: targetEventTypes || null,
      targetPortalPropagation: targetPortalPropagation || false,
    }; // We use responder as a Map key later on. When we have a bad
    // polyfill, then we can't use it as a key as the polyfill tries
    // to add a property to the object.

    if (true && !hasBadMapPolyfill) {
      Object.freeze(eventResponder);
    }

    return eventResponder;
  }

  function createScope() {
    var scopeComponent = {
      $$typeof: REACT_SCOPE_TYPE,
    };

    {
      Object.freeze(scopeComponent);
    }

    return scopeComponent;
  }
  // 对外暴露的一些静态 api 接口
  var React = {
    Children: {
      //使用文档 https://segmentfault.com/a/1190000011527160
      map: mapChildren, //为什么用React.Children.map(props.children, () => )而不是props.children.map(() => ) 不能保证props.children将是一个数组。
      forEach: forEachChildren, // 循环 所有的 子节点  合并遍历上下文
      count: countChildren, //  计算子节点数量 遍历所有的子结点 返回子节点的数量
      toArray: toArray, //   把children变成数组
      only: onlyChild, //   检验是否是react vonde
    },
    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,
    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,
    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,
    Fragment: REACT_FRAGMENT_TYPE,
    Profiler: REACT_PROFILER_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,
    /*
        创建带有验证的元素 
         返回数据类型为
         {
            $$typeof: Symbol(react.element)
            type: "h1"
            key: null
            ref: null
            props: {children: "Hello, world"}
            _owner: null
            _store: {validated: false}
            _self: null
            _source: null
         }
        */
    createElement: createElementWithValidation,
    // 克隆节点
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,
    version: ReactVersion,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals$2,
  };

  if (exposeConcurrentModeAPIs) {
    React.useTransition = useTransition;
    React.useDeferredValue = useDeferredValue;
    React.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
    React.unstable_withSuspenseConfig = withSuspenseConfig;
  }

  if (enableFlareAPI) {
    React.unstable_useResponder = useResponder;
    React.unstable_createResponder = createEventResponder;
  }

  if (enableFundamentalAPI) {
    React.unstable_createFundamental = createFundamentalComponent;
  }

  if (enableScopeAPI) {
    React.unstable_createScope = createScope;
  } // Note: some APIs are added with feature flags.
  // Make sure that stable builds for open source
  // don't modify the React object to avoid deopts.
  // Also let's not expose their names in stable builds.

  if (enableJSXTransformAPI) {
    {
      React.jsxDEV = jsxWithValidation;
      React.jsx = jsxWithValidationDynamic;
      React.jsxs = jsxWithValidationStatic;
    }
  }

  var React$2 = Object.freeze({
    default: React,
  });

  var React$3 = (React$2 && React) || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.

  var react = React$3.default || React$3;

  return react;
});