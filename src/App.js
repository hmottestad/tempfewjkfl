import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import DcatApNoShacl from './dcat-ap-no-shacl.js';
import Example from './example.js';
import Shacl from './SHACL/Shacl.js';


class App extends Component {
  render() {

      let shacl = new Shacl(DcatApNoShacl.dcatNoShacl);

      shacl.validate(Example.example, failure => {
          if(failure.severity === Shacl.Violation){
              console.log(failure);
          }
      });

    return (
      <div >
          <pre></pre>
      </div>
    );
  }
}

export default App;
