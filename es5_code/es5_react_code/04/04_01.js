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

var Show = function Show(props) {
    var flag = props.flag;

    React.useEffect(function() {
        console.log(1);

        return function() {
            console.log(2);
        };
    });

    return React.createElement(
        "div",
        null,
        " ",
        flag ? React.createElement(
            "div",
            null,
            " 显示"
        ) : null,
        " "
    );
};

var LazyPage = function LazyPage() {
    var _React$useState = React.useState("zhangsan");

    var _React$useState2 = _slicedToArray(_React$useState, 2);

    var name = _React$useState2[0];
    var setName = _React$useState2[1];

    var _React$useState3 = React.useState(true);

    var _React$useState32 = _slicedToArray(_React$useState3, 2);

    var flag = _React$useState32[0];
    var setFlag = _React$useState32[1];

    return React.createElement(
        "div",
        null,
        React.createElement(
            "button", {
                onClick: function() {
                    setFlag(false);
                }
            },
            "按钮"
        ),
        React.createElement(
            Show, {
                flag: flag
            },
            " "
        ),
        React.createElement(
            "p",
            null,
            " My Name is: ",
            name,
            " "
        ),
        React.createElement("input", {
            type: "text",
            value: name,
            onChange: function(e) {
                return setName(e.target.value);
            }
        })
    );
};

ReactDOM.render(React.createElement(LazyPage, null), document.getElementById("example"));