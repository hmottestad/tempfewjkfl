import Shacl from "./Shacl.js";

class BasePropertyShape {
    severity = null;
    shape = null;

    constructor(jsonld, shape) {
        if (jsonld[Shacl.severity] !== undefined) {
            this.severity = jsonld[Shacl.severity][0]["@id"];
        }
        this.shape = shape;
    }

    validate(jsonld, failureCallback) {
    }

}

export default BasePropertyShape;