import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";


class NodeKindPropertyShape extends MinMaxCountPropertyShape {

    nodeKind = null;

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.nodeKind = jsonld[Shacl.nodeKind][0]["@id"];

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        if (jsonld[this.path] !== undefined) {
            for (let object of jsonld[this.path]) {
                if (this.nodeKind === Shacl.Literal && object["@value"] === undefined) {
                    failureCallback(new ValidationError(this, "meesage"))
                } else if (this.nodeKind === Shacl.BlankNodeOrIRI && object["@id"] === undefined) {
                    failureCallback(new ValidationError(this, "meesage"))
                } else if (this.nodeKind === Shacl.IRI && (object["@id"] === undefined || object["@id"].indexOf("_:") === 0)) {
                    failureCallback(new ValidationError(this, "meesage"))
                }
            }
        }

    }
}

export default NodeKindPropertyShape;