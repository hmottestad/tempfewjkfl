import Shacl from "./Shacl.js";
import PropertyShape from "./PropertyShape.js";

class Shape {

    scopeClass = null;
    property = [];


    constructor(jsonld) {
        if (jsonld[Shacl.scopeClass] !== undefined) {
            this.scopeClass = jsonld[Shacl.scopeClass][0]["@id"];
        }

        if (jsonld[Shacl.property] !== undefined) {
            this.property = jsonld[Shacl.property].map(property => {
                return PropertyShape.getInstance(property, this)
            });
        }
    }

    validate(jsonld, failureCallback) {
        if (jsonld === undefined) return;

        for (let resource of jsonld) {
            this.property.forEach(propertyShape => propertyShape.validate(resource, failureCallback));
        }


    }

}

export default Shape;