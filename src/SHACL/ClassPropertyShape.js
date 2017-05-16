import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";


class ClassPropertyShape extends MinMaxCountPropertyShape {

    class = null;

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.class = jsonld[Shacl.class][0]["@id"];

    }


    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);
    }

}

export default ClassPropertyShape;