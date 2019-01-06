import React, { Component } from "react";
import Map from "ol/Map";
import PropTypes from "prop-types";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";

import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import GPX from "ol/format/GPX";
import ElevationProfile from "../ElevationProfile/ElevationProfile";

const style = {
  Point: new Style({
    image: new Circle({
      fill: new Fill({
        color: "rgba(255,255,0,0.8)"
      }),
      radius: 5,
      stroke: new Stroke({
        color: "#ff0",
        width: 1
      })
    })
  }),
  LineString: new Style({
    stroke: new Stroke({
      // color: '#000',
      width: 3
    })
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "rgba(0,60,136)",
      width: 4
    })
  })
};

class GpxLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: null
    };
  }

  componentDidMount() {
    const { onSourceLoad, gpxUrl, map } = this.props;

    const source = new VectorSource({
      url: gpxUrl,
      format: new GPX()
    });

    const vectorLayer = new VectorLayer({
      source,
      style(feature) {
        return style[feature.getGeometry().getType()];
      }
    });

    map.addLayer(vectorLayer);

    source.once("change", evt => {
      if (evt.target.getState() === "ready") {
        onSourceLoad();
        this.setState({
          source
        });
      }
    });
  }

  render() {
    const { source } = this.state;
    const { showElevationProfile } = this.props;
    return source && showElevationProfile ? (
      <ElevationProfile source={source} />
    ) : null;
  }
}

GpxLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  gpxUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  onSourceLoad: PropTypes.func.isRequired
};

export default GpxLayer;
