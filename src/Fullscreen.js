import React from 'react';
import Dropzone from 'react-dropzone'
import DcatApNoShacl from './dcat-ap-no-shacl.js'
import Shacl from './SHACL/Shacl.js';
import RdfToJsonLD from "./RdfToJsonLD.js";
import ValidationError from "./SHACL/ValidationError.js";

class Fullscreen extends React.Component {
    constructor() {
        super();
        this.state = {
            accept: '',
            files: [],
            dropzoneActive: false,
            shacl: null,
            validationErrors: [],
        }

        this.validate = this.validate.bind(this);
    }

    componentWillMount() {

        let that = this;
        DcatApNoShacl.asJsonLd().then(shacl => {
            that.setState({shacl: new Shacl(shacl)})
        }).catch(err => {
            console.log(err)
        })


    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files) {

        this.setState({
            files,
            dropzoneActive: false,
            validationErrors: []
        });

        this.validate(files[0]);

    }

    validate(file) {
        console.log(file)

        let reader = new FileReader();


        reader.onload = function (e) {
            let text = reader.result;


            if (file.name.indexOf(".json") > 0 || file.name.indexOf(".jsonld") > 0) {
                console.log("JSONLD")
            } else {
                //assume turtle


                RdfToJsonLD.rdfToJsonld(text).then(jsonld => {
                    this.state.shacl.validate(jsonld, error => {
                        let validationErrors = this.state.validationErrors;
                        validationErrors.push(error);
                        this.setState({validationErrors})
                    })
                }).catch(error => {
                    console.error(error)
                    this.setState({syntaxError:":("})
                })

            }


        };

        reader.onload = reader.onload.bind(this);


        reader.readAsText(file);


    }

    applyMimeTypes(event) {
        this.setState({
            accept: event.target.value
        });
    }

    render() {
        const {accept, files, dropzoneActive} = this.state;
        const overlayStyle = {
            position: 'absolute',
            top: 12,
            right: 0,
            bottom: 0,
            left: 12,
            height: 268,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff',
            marginRight: 12,
        };


        console.log(this.state);

        if (!this.state.shacl) {
            return <h4>Laster</h4>
        }

        let forMangeFiler = files.length > 1

        let gyldig = files.length === 1 && this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length === 0
        let ikkeGyldig = files.length === 1 && this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length > 0

        let groupedValidationWarnings = {};
        this.state.validationErrors.filter(error => Shacl.Warning == error.severity).forEach(error => {

            if (!groupedValidationWarnings[error.jsonld["@id"]]) {
                groupedValidationWarnings[error.jsonld["@id"]] = {"@type": error.targetClass};
            }
            if (!groupedValidationWarnings[error.jsonld["@id"]][error.path]) {
                groupedValidationWarnings[error.jsonld["@id"]][error.path] = [];
            }
            groupedValidationWarnings[error.jsonld["@id"]][error.path].push(error);

        });


        let groupedValidationViolations = {};
        this.state.validationErrors.filter(error => Shacl.Violation == error.severity).forEach(error => {

            if(!error.jsonld){
                console.error(error)
                //return;
            }


            if (!groupedValidationViolations[error.jsonld["@id"]]) {
                groupedValidationViolations[error.jsonld["@id"]] = {"@type": error.targetClass};
            }
            if (!groupedValidationViolations[error.jsonld["@id"]][error.path]) {
                groupedValidationViolations[error.jsonld["@id"]][error.path] = [];
            }
            groupedValidationViolations[error.jsonld["@id"]][error.path].push(error);

        });



        return (
        <div style={{marginTop: -10, padding: 10, marginRight: -15, marginLeft: -15, minHeight: 300}}>
            {/*<div className={gyldig ? "faded-green-background" : ikkeGyldig ? "faded-red-background" : ""} style={{marginTop: -10, padding: 10, marginRight: -15, marginLeft: -15, minHeight: 1000}}>*/}

            <div >
                <Dropzone
                    disableClick
                    style={{border: "dashed"}}
                    accept={accept}
                    onDrop={this.onDrop.bind(this)}
                    onDragEnter={this.onDragEnter.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
                >
                    { dropzoneActive && <div style={overlayStyle}>Slipp</div> }
                    <div style={{height: 240, width: "100%"}}>

                        <h3 style={{textAlign: "center", paddingTop: 90}}>Slipp en DCAT fil her</h3>
                        {forMangeFiler && <h4 style={{textAlign: "center"}}>For mange filer!</h4>}
                        {gyldig && <h4 style={{textAlign: "center"}} className="green"><span className="lighter-black">"{this.state.files[0].name}"</span> er gyldig <span >✓</span></h4>}
                        {ikkeGyldig && <h4 style={{textAlign: "center"}} className="red"><span className="lighter-black">"{this.state.files[0].name}"</span> er ikke gyldig <span >✗</span></h4>}
                        {this.state.syntaxError && <h4 style={{textAlign: "center"}} className="red"><span className="lighter-black">"{this.state.files[0].name}"</span> har syntax feil <span >✗</span></h4>}

                        </div>
                </Dropzone>
            </div>
            <div>
                <h2><a className="link" href="#_Avvik" id="_Avvik">Avvik</a></h2>
                {Object.keys(groupedValidationViolations).map(id =>
                    <RenderError id={id} group={groupedValidationViolations}/>
                )}
                {this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length == 0 && <p>Ingen avvik</p>}

            </div>
            <div>
                <h2><a className="link" href="#_Anbefalinger" id="_Anbefalinger">Anbefalinger</a></h2>
                {Object.keys(groupedValidationWarnings).map(id =>
                    <RenderError id={id} group={groupedValidationWarnings}/>
                )}
                {this.state.validationErrors.filter(error => Shacl.Warning == error.severity).length == 0 && <p>Ingenting å forbedre</p>}

                {/*<ul>*/}
                {/*{this.state.validationErrors.filter(error => Shacl.Warning == error.severity).map((error, index) => <RenderError error={error} key={index}/>)}*/}
                {/*</ul>*/}
            </div>

        </div>
    )
        ;
    }
}

class RenderError extends React.Component {


    render() {

        let id = this.props.id;
        let group = this.props.group;

        return <span>
            <h4>Ressurs <span style={{color: "darkgreen"}}>{id}</span></h4>
                            <h6>Type: <span style={{color: "darkgreen"}}>{ValidationError.prefix(group[id]["@type"])}</span></h6>
                            <ul>
                                {Object.keys(group[id])
                                    .filter(predikat => !predikat.indexOf("@") == 0)
                                    .map(predikat =>
                                        <li style={{listStyle: "none"}}>
                                            <div>
                                                <h7 style={{color: "darkgreen"}}>{ValidationError.prefix(predikat)}</h7>

                                                <ul>
                                                    {Object.values(group[id][predikat]).map(error => {
                                                            return <li style={{listStyle: "none"}}>{error.message}</li>
                                                        }
                                                    )}
                                                </ul>

                                            </div>
                                        </li>
                                    )}
                            </ul>
            <hr/>
                        </span>;


    }


}

export default Fullscreen;