'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = 'src/Fullscreen.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _dcatApNoShacl = require('./dcat-ap-no-shacl.js');

var _dcatApNoShacl2 = _interopRequireDefault(_dcatApNoShacl);

var _Shacl = require('./SHACL/Shacl.js');

var _Shacl2 = _interopRequireDefault(_Shacl);

var _RdfToJsonLD = require('./RdfToJsonLD.js');

var _RdfToJsonLD2 = _interopRequireDefault(_RdfToJsonLD);

var _ValidationError = require('./SHACL/ValidationError.js');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _LanguagesSkos = require('./vokabular/Languages-skos.js');

var _LanguagesSkos2 = _interopRequireDefault(_LanguagesSkos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Fullscreen = function (_React$Component) {
    _inherits(Fullscreen, _React$Component);

    function Fullscreen() {
        _classCallCheck(this, Fullscreen);

        var _this = _possibleConstructorReturn(this, (Fullscreen.__proto__ || Object.getPrototypeOf(Fullscreen)).call(this));

        _this.state = {
            accept: '',
            files: [],
            dropzoneActive: false,
            shacl: null,
            validationErrors: [],
            loading: false
        };

        _this.validate = _this.validate.bind(_this);
        return _this;
    }

    _createClass(Fullscreen, [{
        key: 'componentWillMount',
        value: function componentWillMount() {

            var that = this;
            _dcatApNoShacl2.default.asJsonLd().then(function (shacl) {
                that.setState({ shacl: new _Shacl2.default(shacl) });
            }).catch(function (err) {
                console.log(err);
            });
        }
    }, {
        key: 'onDragEnter',
        value: function onDragEnter() {
            this.setState({
                dropzoneActive: true
            });
        }
    }, {
        key: 'onDragLeave',
        value: function onDragLeave() {
            this.setState({
                dropzoneActive: false
            });
        }
    }, {
        key: 'onDrop',
        value: function onDrop(files) {

            this.setState({
                files: files,
                dropzoneActive: false,
                validationErrors: []
            });

            this.validate(files[0]);
        }
    }, {
        key: 'validate',
        value: function validate(file) {
            console.log(file);

            this.setState({ syntaxError: null });
            this.setState({ loading: true });

            var reader = new FileReader();

            reader.onload = function (e) {
                var text = reader.result;

                var background = function background() {
                    var _this2 = this;

                    if (file.name.indexOf(".json") > 0 || file.name.indexOf(".jsonld") > 0) {
                        console.log("JSONLD");
                    } else {
                        //assume turtle


                        _RdfToJsonLD2.default.rdfToJsonld(text + "\n" + _LanguagesSkos2.default.ntriples).then(function (jsonld) {
                            _this2.state.shacl.validate(jsonld, function (error) {
                                var validationErrors = _this2.state.validationErrors;
                                validationErrors.push(error);
                                _this2.setState({ validationErrors: validationErrors });
                                _this2.setState({ loading: false });
                            });
                        }).catch(function (error) {
                            console.error(error);
                            _this2.setState({ loading: false });
                            _this2.setState({ syntaxError: ":(" });
                        });
                    }
                };

                background = background.bind(this);
                window.setTimeout(background, 100);
            };

            reader.onload = reader.onload.bind(this);

            reader.readAsText(file);
        }
    }, {
        key: 'applyMimeTypes',
        value: function applyMimeTypes(event) {
            this.setState({
                accept: event.target.value
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state,
                accept = _state.accept,
                files = _state.files,
                dropzoneActive = _state.dropzoneActive;

            var overlayStyle = {
                position: 'absolute',
                top: 12,
                right: 0,
                bottom: 0,
                left: 12,
                height: 268,
                padding: '2.5em 0',
                background: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
                color: '#fff',
                marginRight: 12
            };

            console.log(this.state);

            var loading = this.state.loading;

            if (!this.state.shacl) {
                return _react2.default.createElement(
                    'h4',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 138
                        },
                        __self: this
                    },
                    'Laster'
                );
            }

            var forMangeFiler = files.length > 1;

            var syntaxError = this.state.syntaxError;

            var gyldig = files.length === 1 && this.state.validationErrors.filter(function (error) {
                return _Shacl2.default.Violation == error.severity;
            }).length === 0;
            var ikkeGyldig = files.length === 1 && this.state.validationErrors.filter(function (error) {
                return _Shacl2.default.Violation == error.severity;
            }).length > 0;

            if (syntaxError) {
                gyldig = false;
                ikkeGyldig = false;
            }

            var groupedValidationWarnings = {};
            this.state.validationErrors.filter(function (error) {
                return _Shacl2.default.Warning == error.severity;
            }).forEach(function (error) {

                if (!groupedValidationWarnings[error.jsonld["@id"]]) {
                    groupedValidationWarnings[error.jsonld["@id"]] = { "@type": error.targetClass };
                }
                if (!groupedValidationWarnings[error.jsonld["@id"]][error.path]) {
                    groupedValidationWarnings[error.jsonld["@id"]][error.path] = [];
                }
                groupedValidationWarnings[error.jsonld["@id"]][error.path].push(error);
            });

            var groupedValidationViolations = {};
            this.state.validationErrors.filter(function (error) {
                return _Shacl2.default.Violation == error.severity;
            }).forEach(function (error) {

                if (!error.jsonld) {
                    console.error(error);
                    //return;
                }

                if (!groupedValidationViolations[error.jsonld["@id"]]) {
                    groupedValidationViolations[error.jsonld["@id"]] = { "@type": error.targetClass };
                }
                if (!groupedValidationViolations[error.jsonld["@id"]][error.path]) {
                    groupedValidationViolations[error.jsonld["@id"]][error.path] = [];
                }
                groupedValidationViolations[error.jsonld["@id"]][error.path].push(error);
            });

            return _react2.default.createElement(
                'div',
                { style: { marginTop: -10, padding: 10, marginRight: -15, marginLeft: -15, minHeight: 300 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 188
                    },
                    __self: this
                },
                _react2.default.createElement(
                    'div',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 191
                        },
                        __self: this
                    },
                    _react2.default.createElement(
                        _reactDropzone2.default,
                        {
                            disableClick: true,
                            style: { border: "dashed" },
                            accept: accept,
                            onDrop: this.onDrop.bind(this),
                            onDragEnter: this.onDragEnter.bind(this),
                            onDragLeave: this.onDragLeave.bind(this),
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 192
                            },
                            __self: this
                        },
                        dropzoneActive && _react2.default.createElement(
                            'div',
                            { style: overlayStyle, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 200
                                },
                                __self: this
                            },
                            'Slipp'
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: { height: 240, width: "100%" }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 201
                                },
                                __self: this
                            },
                            _react2.default.createElement(
                                'h3',
                                { style: { textAlign: "center", paddingTop: 90 }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 203
                                    },
                                    __self: this
                                },
                                'Slipp en DCAT fil her'
                            ),
                            forMangeFiler && _react2.default.createElement(
                                'h4',
                                { style: { textAlign: "center" }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 204
                                    },
                                    __self: this
                                },
                                'For mange filer!'
                            ),
                            !loading && gyldig && _react2.default.createElement(
                                'h4',
                                { style: { textAlign: "center" }, className: 'green', __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 205
                                    },
                                    __self: this
                                },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'lighter-black', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 205
                                        },
                                        __self: this
                                    },
                                    '"',
                                    this.state.files[0].name,
                                    '"'
                                ),
                                ' er gyldig ',
                                _react2.default.createElement(
                                    'span',
                                    {
                                        __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 205
                                        },
                                        __self: this
                                    },
                                    '\u2713'
                                )
                            ),
                            !loading && ikkeGyldig && _react2.default.createElement(
                                'h4',
                                { style: { textAlign: "center" }, className: 'red', __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 206
                                    },
                                    __self: this
                                },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'lighter-black', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 206
                                        },
                                        __self: this
                                    },
                                    '"',
                                    this.state.files[0].name,
                                    '"'
                                ),
                                ' er ikke gyldig ',
                                _react2.default.createElement(
                                    'span',
                                    {
                                        __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 206
                                        },
                                        __self: this
                                    },
                                    '\u2717'
                                )
                            ),
                            !loading && syntaxError && _react2.default.createElement(
                                'h4',
                                { style: { textAlign: "center" }, className: 'red', __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 207
                                    },
                                    __self: this
                                },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'lighter-black', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 207
                                        },
                                        __self: this
                                    },
                                    '"',
                                    this.state.files[0].name,
                                    '"'
                                ),
                                ' har syntax feil ',
                                _react2.default.createElement(
                                    'span',
                                    {
                                        __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 207
                                        },
                                        __self: this
                                    },
                                    '\u2717'
                                )
                            ),
                            loading && _react2.default.createElement(
                                'h4',
                                { style: { textAlign: "center" }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 208
                                    },
                                    __self: this
                                },
                                'Validerer ',
                                _react2.default.createElement(
                                    'span',
                                    { className: 'lighter-black', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 208
                                        },
                                        __self: this
                                    },
                                    '"',
                                    this.state.files[0].name,
                                    '"'
                                ),
                                '...'
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 212
                        },
                        __self: this
                    },
                    _react2.default.createElement(
                        'h2',
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 213
                            },
                            __self: this
                        },
                        _react2.default.createElement(
                            'a',
                            { className: 'link', href: '#_Avvik', id: '_Avvik', __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 213
                                },
                                __self: this
                            },
                            'Avvik'
                        )
                    ),
                    Object.keys(groupedValidationViolations).map(function (id) {
                        return _react2.default.createElement(RenderError, { id: id, group: groupedValidationViolations, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 215
                            },
                            __self: _this3
                        });
                    }),
                    this.state.validationErrors.filter(function (error) {
                        return _Shacl2.default.Violation == error.severity;
                    }).length == 0 && _react2.default.createElement(
                        'p',
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 217
                            },
                            __self: this
                        },
                        'Ingen avvik'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 220
                        },
                        __self: this
                    },
                    _react2.default.createElement(
                        'h2',
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 221
                            },
                            __self: this
                        },
                        _react2.default.createElement(
                            'a',
                            { className: 'link', href: '#_Anbefalinger', id: '_Anbefalinger', __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 221
                                },
                                __self: this
                            },
                            'Anbefalinger'
                        )
                    ),
                    Object.keys(groupedValidationWarnings).map(function (id) {
                        return _react2.default.createElement(RenderError, { id: id, group: groupedValidationWarnings, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 223
                            },
                            __self: _this3
                        });
                    }),
                    this.state.validationErrors.filter(function (error) {
                        return _Shacl2.default.Warning == error.severity;
                    }).length == 0 && _react2.default.createElement(
                        'p',
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 225
                            },
                            __self: this
                        },
                        'Ingenting \xE5 forbedre'
                    )
                )
            );
        }
    }]);

    return Fullscreen;
}(_react2.default.Component);

var RenderError = function (_React$Component2) {
    _inherits(RenderError, _React$Component2);

    function RenderError() {
        _classCallCheck(this, RenderError);

        return _possibleConstructorReturn(this, (RenderError.__proto__ || Object.getPrototypeOf(RenderError)).apply(this, arguments));
    }

    _createClass(RenderError, [{
        key: 'render',
        value: function render() {
            var _this5 = this;

            var id = this.props.id;
            var group = this.props.group;

            return _react2.default.createElement(
                'span',
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 246
                    },
                    __self: this
                },
                _react2.default.createElement(
                    'h4',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 247
                        },
                        __self: this
                    },
                    'Ressurs ',
                    _react2.default.createElement(
                        'span',
                        { style: { color: "darkgreen" }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 247
                            },
                            __self: this
                        },
                        id
                    )
                ),
                _react2.default.createElement(
                    'h6',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 248
                        },
                        __self: this
                    },
                    'Type: ',
                    _react2.default.createElement(
                        'span',
                        { style: { color: "darkgreen" }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 248
                            },
                            __self: this
                        },
                        _ValidationError2.default.prefix(group[id]["@type"])
                    )
                ),
                _react2.default.createElement(
                    'ul',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 249
                        },
                        __self: this
                    },
                    Object.keys(group[id]).filter(function (predikat) {
                        return !predikat.indexOf("@") == 0;
                    }).map(function (predikat) {
                        return _react2.default.createElement(
                            'li',
                            { style: { listStyle: "none" }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 253
                                },
                                __self: _this5
                            },
                            _react2.default.createElement(
                                'div',
                                {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 254
                                    },
                                    __self: _this5
                                },
                                _react2.default.createElement(
                                    'h7',
                                    { style: { color: "darkgreen" }, __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 255
                                        },
                                        __self: _this5
                                    },
                                    _ValidationError2.default.prefix(predikat)
                                ),
                                _react2.default.createElement(
                                    'ul',
                                    {
                                        __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 257
                                        },
                                        __self: _this5
                                    },
                                    Object.values(group[id][predikat]).map(function (error) {
                                        return _react2.default.createElement(
                                            'li',
                                            { style: { listStyle: "none" }, __source: {
                                                    fileName: _jsxFileName,
                                                    lineNumber: 259
                                                },
                                                __self: _this5
                                            },
                                            error.message
                                        );
                                    })
                                )
                            )
                        );
                    })
                ),
                _react2.default.createElement('hr', {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 268
                    },
                    __self: this
                })
            );
        }
    }]);

    return RenderError;
}(_react2.default.Component);

exports.default = Fullscreen;
//# sourceMappingURL=Fullscreen.js.map