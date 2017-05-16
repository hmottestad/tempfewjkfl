'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = 'src/App.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dcatApNoShacl = require('./dcat-ap-no-shacl.js');

var _dcatApNoShacl2 = _interopRequireDefault(_dcatApNoShacl);

var _example = require('./example.js');

var _example2 = _interopRequireDefault(_example);

var _Shacl = require('./SHACL/Shacl.js');

var _Shacl2 = _interopRequireDefault(_Shacl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import logo from './logo.svg';


var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {

            var shacl = new _Shacl2.default(_dcatApNoShacl2.default.dcatNoShacl);

            shacl.validate(_example2.default.example, function (failure) {
                if (failure.severity === _Shacl2.default.Violation) {
                    console.log(failure);
                }
            });

            return _react2.default.createElement(
                'div',
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 21
                    },
                    __self: this
                },
                _react2.default.createElement('pre', {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 22
                    },
                    __self: this
                })
            );
        }
    }]);

    return App;
}(_react.Component);

exports.default = App;
//# sourceMappingURL=App.js.map