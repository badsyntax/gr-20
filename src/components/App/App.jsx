import React, { Component } from "react";
import Map from "../Map/Map";
import Form from "../Form/Form";
import maps from "../../data/maps/maps";
import routes from "../../data/routes/routes";

import "./App.css";

class App extends Component {
  state = {
    formValues: {
      map: maps[0].url,
      showElevationProfile: false,
      route: routes[0].url
    }
  };

  onFormChange = formValues => {
    this.setState({
      formValues
    });
  };

  render() {
    const { formValues } = this.state;
    return (
      <div className="App">
        <Form
          values={formValues}
          mapOptions={maps}
          routeOptions={routes}
          onChange={this.onFormChange}
        />
        <Map
          map={formValues.map}
          showElevationProfile={formValues.showElevationProfile}
        />
      </div>
    );
  }
}

export default App;
