import React, { Component } from "react";
import Map, { maps } from "../Map/Map";
import Form from "../Form/Form";

import "./App.css";

class App extends Component {
  state = {
    source: null,
    formValues: {
      map: maps[0].url
    }
  };

  onFormChange = formValues => {
    // console.log("formValues", formValues);
    this.setState({
      formValues
    });
  };

  onSourceReady = source => {
    this.setState({
      source
    });
  };

  render() {
    const { formValues } = this.state;
    return (
      <div className="App">
        <Form
          values={formValues}
          mapOptions={maps}
          onChange={this.onFormChange}
        />
        <Map map={formValues.map} onSourceReady={this.onSourceReady} />
      </div>
    );
  }
}

export default App;
