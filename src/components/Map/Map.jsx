/* eslint-disable func-names */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls } from "ol/control";

import { fromLonLat } from "ol/proj";
import "./Map.css";
import "react-vis/dist/style.css";

import route1 from "../../data/routes/gr20-2018-complete-northsouth.gpx";

import Popup from "../Popup/Popup";
import Spinner from "../Spinner/Spinner";
import MapControls from "../MapControls/MapControls";
import GpxLayer from "../GpxLayer/GpxLayer";
import TileLayer from "../TileLayer/TileLayer";

class MyMap extends React.Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.popupContainerRef = React.createRef();
    this.popupContentRef = React.createRef();
    this.map = new Map({
      renderer: "canvas",
      controls: defaultControls({ attribution: false })
    });
    this.state = {
      lat: 42.184207,
      lng: 9.1079,
      zoom: 9,
      mapReady: false,
      sourceLoaded: false
    };
  }

  componentDidMount() {
    const { map } = this;
    const { lat, lng, zoom } = this.state;
    const target = this.mapRef.current;

    const view = new View({
      center: fromLonLat([lng, lat]),
      zoom
    });

    map.setTarget(target);
    map.setView(view);

    const displayFeatureInfo = function(pixel, evt) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, feature => {
        features.push(feature);
      });
      if (features.length > 0) {
        map.getTarget().style.cursor = "pointer";
      } else {
        map.getTarget().style.cursor = "";
      }
    };

    map.on("pointermove", evt => {
      if (evt.originalEvent.target.nodeName.toLowerCase() === "canvas") {
        const pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel, evt);
      }
    });

    this.setState({
      mapReady: true
    });
  }

  onSourceLoad = () => {
    this.setState({
      sourceLoaded: true
    });
  };

  render() {
    const { mapReady, sourceLoaded } = this.state;
    const { showElevationProfile, mapUrl } = this.props;
    return (
      <div ref={this.mapRef} className="Map">
        {!sourceLoaded && <Spinner />}
        {mapReady && (
          <Fragment>
            <Popup map={this.map} />
            <MapControls map={this.map} />
            <TileLayer mapUrl={mapUrl} map={this.map} />
            <GpxLayer
              map={this.map}
              showElevationProfile={showElevationProfile}
              onSourceLoad={this.onSourceLoad}
              gpxUrl={route1}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

MyMap.propTypes = {
  mapUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired
};
export default MyMap;
