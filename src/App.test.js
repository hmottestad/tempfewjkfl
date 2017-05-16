import React from "react";
import it from "it-is";
import rdf from "rdf";
import IndexedGraph from "rdf";

it('renders without crashing', () => {


});

it("hello").equal("hello")
// it("hello").equal("nay")


console.log("HERE");

let rdfText = `
@prefix c: <http://example.org/cartoons#>.
c:Tom a c:Cat.
c:Jerry a c:Mouse;
        c:label "hello";
        c:age 3;
        c:name "Jerry"@en;
        c:list ([] [] [c:know c:Tom;]) ;
        c:smarterThan c:Tom, [].
`;


function convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex){

    let list = [];

    let node = tempJsonLd[subject[predicate][objectIndex]["@id"]];

    while(node !== undefined){

        list.push(node["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"][0]);

        node = tempJsonLd[node["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"][0]["@id"]];



    }

    subject[predicate][objectIndex] = {"@list":list};

    console.log(subject[predicate][objectIndex])
}



let k = new Promise(function(resolve, reject) {

    var env=rdf.environment;

    let graph = env.createGraph();
    let turtleParser = new rdf.TurtleParser();
    let temp = turtleParser.parse(rdfText, function(){

        let tempJsonLd = {};

        graph.forEach(triple =>  {
            if(!tempJsonLd[triple.subject.nominalValue]){
                tempJsonLd[triple.subject.nominalValue] = {"@id":triple.subject.nominalValue};
            }

            if(triple.predicate.nominalValue === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"){
                if(!tempJsonLd[triple.subject.nominalValue]["@type"]){
                    tempJsonLd[triple.subject.nominalValue]["@type"] = [];
                }

                tempJsonLd[triple.subject.nominalValue]["@type"].push(triple.object.nominalValue);


            }

            if(!tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue]){
                tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue] = [];
            }

            let object = {};

            let type = triple.object.nodeType();

            if(type.indexOf("Literal") < 0){
                object["@id"] = triple.object.nominalValue;
            }else{
                object["@value"] =triple.object.nominalValue;
                if(triple.object.datatype){
                    object["@datatype"] =triple.object.datatype;
                }
                if(triple.object.language){
                    object["@language"] =triple.object.language;
                }
            }


            tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue].push(object);



        });



        Object
            .keys(tempJsonLd)
            .map( key => tempJsonLd[key])
            .filter(subject => subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined)
            .forEach(subject => {

            Object.keys(subject)
                .filter(predicate => Array.isArray(subject[predicate]))
                .forEach(predicate => {
                   for(let objectIndex in subject[predicate]){
                       let object = subject[predicate][objectIndex];
                       if(object["@id"] === undefined) continue;

                       if(tempJsonLd[object["@id"]] !== undefined && tempJsonLd[object["@id"]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] !== undefined){
                           convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex);
                       }

                   }


            })
        })




        let realJsonLd = [];

        Object.keys(tempJsonLd)
            .filter(key => tempJsonLd[key]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined)
            .forEach(key => realJsonLd.push(tempJsonLd[key]));

        resolve(realJsonLd);

    }, "", null, graph);



} );

k.then(jsonld => console.log(JSON.stringify(jsonld, null, 4)))
