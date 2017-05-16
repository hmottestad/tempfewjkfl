"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _itIs = require("it-is");

var _itIs2 = _interopRequireDefault(_itIs);

var _rdf = require("rdf");

var _rdf2 = _interopRequireDefault(_rdf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _itIs2.default)('renders without crashing', function () {});

(0, _itIs2.default)("hello").equal("hello");
// it("hello").equal("nay")


console.log("HERE");

var rdfText = "\n@prefix c: <http://example.org/cartoons#>.\nc:Tom a c:Cat.\nc:Jerry a c:Mouse;\n        c:label \"hello\";\n        c:age 3;\n        c:name \"Jerry\"@en;\n        c:list ([] [] [c:know c:Tom;]) ;\n        c:smarterThan c:Tom, [].\n";

function convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex) {

    var list = [];

    var node = tempJsonLd[subject[predicate][objectIndex]["@id"]];

    while (node !== undefined) {

        list.push(node["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"][0]);

        node = tempJsonLd[node["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"][0]["@id"]];
    }

    subject[predicate][objectIndex] = { "@list": list };

    console.log(subject[predicate][objectIndex]);
}

var k = new Promise(function (resolve, reject) {

    var env = _rdf2.default.environment;

    var graph = env.createGraph();
    var turtleParser = new _rdf2.default.TurtleParser();
    var temp = turtleParser.parse(rdfText, function () {

        var tempJsonLd = {};

        graph.forEach(function (triple) {
            if (!tempJsonLd[triple.subject.nominalValue]) {
                tempJsonLd[triple.subject.nominalValue] = { "@id": triple.subject.nominalValue };
            }

            if (triple.predicate.nominalValue === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                if (!tempJsonLd[triple.subject.nominalValue]["@type"]) {
                    tempJsonLd[triple.subject.nominalValue]["@type"] = [];
                }

                tempJsonLd[triple.subject.nominalValue]["@type"].push(triple.object.nominalValue);
            }

            if (!tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue]) {
                tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue] = [];
            }

            var object = {};

            var type = triple.object.nodeType();

            if (type.indexOf("Literal") < 0) {
                object["@id"] = triple.object.nominalValue;
            } else {
                object["@value"] = triple.object.nominalValue;
                if (triple.object.datatype) {
                    object["@datatype"] = triple.object.datatype;
                }
                if (triple.object.language) {
                    object["@language"] = triple.object.language;
                }
            }

            tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue].push(object);
        });

        Object.keys(tempJsonLd).map(function (key) {
            return tempJsonLd[key];
        }).filter(function (subject) {
            return subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined;
        }).forEach(function (subject) {

            Object.keys(subject).filter(function (predicate) {
                return Array.isArray(subject[predicate]);
            }).forEach(function (predicate) {
                for (var objectIndex in subject[predicate]) {
                    var object = subject[predicate][objectIndex];
                    if (object["@id"] === undefined) continue;

                    if (tempJsonLd[object["@id"]] !== undefined && tempJsonLd[object["@id"]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] !== undefined) {
                        convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex);
                    }
                }
            });
        });

        var realJsonLd = [];

        Object.keys(tempJsonLd).filter(function (key) {
            return tempJsonLd[key]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined;
        }).forEach(function (key) {
            return realJsonLd.push(tempJsonLd[key]);
        });

        resolve(realJsonLd);
    }, "", null, graph);
});

k.then(function (jsonld) {
    return console.log(JSON.stringify(jsonld, null, 4));
});
//# sourceMappingURL=App.test.js.map