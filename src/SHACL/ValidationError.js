// import Shacl from "./Shacl.js";

class ValidationError {

    severity;
    path;
    message;
    scopeClass;

    constructor(propertyShape, message) {
        this.severity = propertyShape.severity;
        this.path = propertyShape.path;
        this.message = message;
        this.scopeClass = propertyShape.shape.scopeClass;

    }

}

export default ValidationError;