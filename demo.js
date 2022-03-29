/*
 * @Author: your name
 * @Date: 2021-05-10 18:11:35
 * @LastEditTime: 2021-05-10 18:15:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /react/demo.js
 */

  var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
  var ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
  
  
  ReactSharedInternals
   ReactCurrentBatchConfig: ReactCurrentBatchConfig, // *跟踪当前批处理的配置，比如更新多长时间  ,  *如有需要，应暂停。
  
    var ReactCurrentBatchConfig = {
      suspense: null,
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
  
  
  
    var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
  
    function requestCurrentSuspenseConfig() {
        /*
          var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
  var ReactCurrentBatchConfig$1 = ReactSharedInternals.ReactCurrentBatchConfig;
        */
      return ReactCurrentBatchConfig.suspense;
    }
  