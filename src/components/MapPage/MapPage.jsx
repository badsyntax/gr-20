import React, { Component } from "react";
import Form from "../Form/Form";
import Map from "../Map/Map";
import maps from "../../data/maps/maps";
import routes from "../../data/routes/routes";
import STYLES from "./MapPage.module.scss";

class MapPage extends Component {
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
      <div className={STYLES.MapPage}>
        <Form
          values={formValues}
          mapOptions={maps}
          routeOptions={routes}
          onChange={this.onFormChange}
        />
        <Map
          mapUrl={formValues.map}
          showElevationProfile={formValues.showElevationProfile}
        />
      </div>
    );
  }
}

export default MapPage;
