"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _itIs = require("it-is");

var _itIs2 = _interopRequireDefault(_itIs);

var _RdfToJsonLD = require("./RdfToJsonLD.js");

var _RdfToJsonLD2 = _interopRequireDefault(_RdfToJsonLD);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _Shacl = require("./SHACL/Shacl.js");

var _Shacl2 = _interopRequireDefault(_Shacl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _itIs2.default)('renders without crashing', function () {});

_fs2.default.readdir("../test-files/", function (err, testCases) {
    // console.log(testCases);
    testCases.forEach(function (testCase) {
        // console.log(testCase);

        new Promise(function (resolve, reject) {
            _fs2.default.readFile("../test-files/" + testCase + "/shacl.ttl", "utf-8", function (err, shacl) {
                _RdfToJsonLD2.default.rdfToJsonld(shacl).then(function (jsonld) {
                    return resolve(jsonld);
                });
                // .catch(error => console.log(error));
            });
        }).then(function (shacl) {

            _fs2.default.readdir("../test-files/" + testCase + "/pass", function (err, passFiles) {

                passFiles.forEach(function (pass) {
                    // console.log(pass);

                    var shaclValidator = new _Shacl2.default(shacl);

                    _fs2.default.readFile("../test-files/" + testCase + "/pass/" + pass, "utf-8", function (err, turtle) {
                        _RdfToJsonLD2.default.rdfToJsonld(turtle).catch(function (error) {
                            return console.error("Error while reading " + testCase + "/pass/" + pass + "\n", error);
                        }).then(function (jsonld) {

                            var valid = true;

                            shaclValidator.validate(jsonld, function (failure) {
                                if (failure.severity === _Shacl2.default.Violation) {
                                    valid = false;
                                    console.log(failure);
                                }
                            });

                            if (!valid) {
                                console.log("here");
                            }
                            (0, _itIs2.default)(valid).equal(true, "Validation should have passed for: " + testCase + "/pass/" + pass);
                        }).catch(function (error) {
                            return console.error("Error while reading or validating " + testCase + "/pass/" + pass + "\n", error);
                        });
                    });
                });
            });

            _fs2.default.readdir("../test-files/" + testCase + "/fail", function (err, failFile) {

                failFile.forEach(function (fail) {
                    var shaclValidator = new _Shacl2.default(shacl);

                    _fs2.default.readFile("../test-files/" + testCase + "/fail/" + fail, "utf-8", function (err, turtle) {
                        _RdfToJsonLD2.default.rdfToJsonld(turtle).catch(function (error) {
                            return console.error("Error while reading " + testCase + "/fail/" + fail + "\n", error);
                        }).then(function (jsonld) {

                            var valid = true;

                            shaclValidator.validate(jsonld, function (failure) {
                                if (failure.severity === _Shacl2.default.Violation) {
                                    valid = false;
                                    // console.log(failure);
                                }
                            });

                            (0, _itIs2.default)(valid).equal(false, "Validation should have failed for: " + testCase + "/fail/" + fail);
                        }).catch(function (error) {
                            return console.log("Error while reading or validating " + testCase + "/fail/" + fail, error);
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=App.test.js.map