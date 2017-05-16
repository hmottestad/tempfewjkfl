import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";

import PathPropertyShape from "./PathPropertyShape.js";


class MinMaxCountPropertyShape extends PathPropertyShape {

    minCount = null;
    maxCount = null;


    constructor(jsonld, shape) {
        super(jsonld, shape);
        if (jsonld[Shacl.minCount] !== undefined) {
            this.minCount = jsonld[Shacl.minCount][0];
        }

        if (jsonld[Shacl.maxCount] !== undefined) {
            this.maxCount = jsonld[Shacl.maxCount][0];
        }
    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        let length = 0;
        if (jsonld[this.path] !== undefined) {
            length = jsonld[this.path].length;
        }

        if (this.maxCount !== null && length > this.maxCount) {
            failureCallback(new ValidationError(this, `Expected maximum ${this.maxCount} but found ${length}`));
        }

        if (this.minCount !== null && length < this.minCount) {
            failureCallback(new ValidationError(this, `Expected minimum ${this.minCount} but found only ${length}`));
        }


    }

}
export default MinMaxCountPropertyShape;