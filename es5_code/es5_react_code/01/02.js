"use strict";

var _slicedToArray = (function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
})();

var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var _React = React;
var useState = _React.useState;

var H = function H() {
    var _useState = useState(arr);

    var _useState2 = _slicedToArray(_useState, 2);

    var arr = _useState2[0];
    var setArr = _useState2[1];

    return React.createElement(
        "h1", {
            arr: [1, 2, 4],
            onClick: function() {
                return console.log(1);
            }
        },
        "Hello, world"
    );
};
var a = {
    name: 1
};
console.log(_extends({}, a));
ReactDOM.render(React.createElement(H, null), document.getElementById("example"));