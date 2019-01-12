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

const getMultiLineStringFeature = layer =>
  layer
    .getSource()
    .getFeatures()
    .find(feature => feature.getGeometry().getType() === "MultiLineString");

const getPointFeatures = layer =>
  layer
    .getSource()
    .getFeatures()
    .filter(feature => feature.getGeometry().getType() === "Point");

const style = {
  Point: new Style({
    image: new Circle({
      fill: new Fill({
        color: "yellow"
      }),
      stroke: new Stroke({ color: "rgba(0,60,136)", width: 1 }),
      radius: 5
    })
  }),
  LineString: new Style({
    stroke: new Stroke({
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
  state = {
    source: null,
    sourceLoaded: false,
    gpxMarkers: [],
    multiLineFeature: null
  };

  componentDidMount() {
    const { map, vectorLayer } = this.props;
    vectorLayer.setStyle(feature => style[feature.getGeometry().getType()]);
    map.addLayer(vectorLayer);
    this.setSource();
  }

  componentDidUpdate(prevProps) {
    const { gpxUrl, showMarkers, showRoute } = this.props;
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSource();
    }
    if (prevProps.showMarkers !== showMarkers) {
      this.toggleMarkers(showMarkers);
    }
    if (prevProps.showRoute !== showRoute) {
      this.toggleRoute(showRoute);
    }
  }

  setSource() {
    const { onSourceChange, vectorLayer, gpxUrl } = this.props;

    const source = new VectorSource({
      url: gpxUrl,
      format: new GPX()
    });
    vectorLayer.setSource(source);

    this.setState({
      source,
      sourceLoaded: false
    });

    onSourceChange(false);
    source.once("change", evt => {
      if (source.getState() === "ready") {
        onSourceChange(true);
        this.setState({
          sourceLoaded: true
        });
      }
    });
  }

  toggleMarkers(show) {
    const { vectorLayer } = this.props;
    if (show) {
      const { gpxMarkers } = this.state;
      gpxMarkers.forEach(markerPoint =>
        vectorLayer.getSource().addFeature(markerPoint)
      );
    } else {
      const gpxMarkers = getPointFeatures(vectorLayer);
      this.setState({
        gpxMarkers
      });
      gpxMarkers.forEach(markerPoint =>
        vectorLayer.getSource().removeFeature(markerPoint)
      );
    }
  }

  toggleRoute(show) {
    const { vectorLayer } = this.props;
    if (show) {
      const { multiLineFeature } = this.state;
      vectorLayer.getSource().addFeature(multiLineFeature);
    } else {
      const multiLineFeature = getMultiLineStringFeature(vectorLayer);
      this.setState({
        multiLineFeature
      });
      vectorLayer.getSource().removeFeature(multiLineFeature);
    }
  }

  render() {
    const { source, sourceLoaded } = this.state;
    const { showElevationProfile, map } = this.props;
    return sourceLoaded && showElevationProfile ? (
      <ElevationProfile source={source} map={map} />
    ) : null;
  }
}

GpxLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,
  gpxUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  onSourceChange: PropTypes.func.isRequired,
  showMarkers: PropTypes.bool.isRequired,
  showRoute: PropTypes.bool.isRequired
};

export default GpxLayer;
