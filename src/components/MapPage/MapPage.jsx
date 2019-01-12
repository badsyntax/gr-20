import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import DropdownGroup from "../DropdownGroup/DropdownGroup";
import Map from "../Map/Map";
import maps from "../../data/maps/maps";
import routes from "../../data/routes/routes";
import STYLES from "./MapPage.module.scss";

class MapPage extends Component {
  state = {
    values: {
      map: maps[0].url,
      showElevationProfile: false,
      showControls: true,
      route: routes[0].url
    }
  };

  onDropdownChange = values => {
    this.setState({
      values
    });
  };

  render() {
    const { values } = this.state;
    const { map, route, showElevationProfile, showControls } = values;
    return (
      <Fragment>
        <Helmet>
          <title>GR-20 - The Route</title>
        </Helmet>
        <div className={STYLES.MapPage}>
          <DropdownGroup
            values={values}
            mapOptions={maps}
            routeOptions={routes}
            onChange={this.onDropdownChange}
          />
          <Map
            mapUrl={map}
            gpxUrl={route}
            showElevationProfile={showElevationProfile}
            showControls={showControls}
          />
        </div>
      </Fragment>
    );
  }
}

export default MapPage;
