import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import PropertyShape from "./PropertyShape.js";
import ValidationError from "./ValidationError.js";


import Shacl from "./Shacl.js";


class OrPropertyShape extends MinMaxCountPropertyShape {

    or = [];

    constructor(jsonld, shape) {
        super(jsonld, shape);

        for (let subPropertyShape of jsonld[Shacl.or][0]["@list"]) {
            let instance = PropertyShape.getInstance(subPropertyShape, shape);
            instance.path = this.path;
            instance.severity = this.severity;

            this.or.push(instance);

        }

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);


        if (jsonld[this.path] === undefined) return;

        for (let object of jsonld[this.path]) {

            console.log(object)

            let numberOfTimesCalled = 0;
            let orFailureCallback = function (failure) {
                numberOfTimesCalled++;
            };

            let temp = {};
            temp[this.path] = [object];

            this.or.forEach(propertyShape => propertyShape.validate(temp, orFailureCallback))

            if (numberOfTimesCalled >= this.or.length) {
                failureCallback(new ValidationError(this, `Didn't match any of the sh:or parts.`))
            }

        }


    }

}

export default OrPropertyShape;