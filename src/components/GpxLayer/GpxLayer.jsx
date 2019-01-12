import React, { Component } from "react";
import Map from "ol/Map";
import PropTypes from "prop-types";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";

import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";

import GPX from "ol/format/GPX";
import ElevationProfile from "../ElevationProfile/ElevationProfile";

import yellowMarker from "./baseline-location_on-24px-yellow.svg";
// import greenMarker from "./baseline-location_on-24px-green.svg";
// import redMarker from "./baseline-location_on-24px-red.svg";

const pointTextStyle = (text, marker, color) =>
  new Style({
    // image: new Circle({
    //   fill: new Fill({
    //     color
    //   }),
    //   radius: 5
    // }),
    image: new Icon({
      anchor: [0.5, 1],
      src: marker
      // size: "50px"
    }),
    text: new Text({
      text,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "#ffffff", width: 2 }),
      font: "bold 13px Arial",
      offsetY: 12
    })
  });

const createPointTextFeature = (name, id, color, marker) => {
  const feature = new Feature({
    name
  });
  feature.setId(id);
  feature.setStyle(pointTextStyle(name, marker, color));
  return feature;
};

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
    // image: new Icon({
    //   src: yellowMarker,
    //   anchor: [0.5, 1]
    // })
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
  state = {
    source: null,
    sourceLoaded: false,
    gpxMarkers: [],
    startEndMarkers: [],
    multiLineFeature: null
  };

  constructor(props) {
    super(props);
    this.gpxVectorLayer = new VectorLayer({
      style(feature) {
        return style[feature.getGeometry().getType()];
      }
    });
    this.startEndVectorLayer = new VectorLayer();
  }

  componentDidMount() {
    const { map } = this.props;
    map.addLayer(this.gpxVectorLayer);
    map.addLayer(this.startEndVectorLayer);
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
    const { onSourceChange, gpxUrl } = this.props;

    const source = new VectorSource({
      url: gpxUrl,
      format: new GPX()
    });
    this.gpxVectorLayer.setSource(source);

    const startEndSource = new VectorSource({
      features: [
        createPointTextFeature(
          "Start",
          "startPoint",
          "rgba(0,60,136)",
          yellowMarker
        ),
        createPointTextFeature(
          "Finish",
          "finishPoint",
          "rgba(0,60,136)",
          yellowMarker
        )
      ]
    });

    this.startEndVectorLayer.setSource(startEndSource);

    this.setState({
      source,
      sourceLoaded: false
    });

    onSourceChange(false);
    source.once("change", evt => {
      if (source.getState() === "ready") {
        const multiLineString = getMultiLineStringFeature(this.gpxVectorLayer);
        const coords = multiLineString
          .getGeometry()
          .getCoordinates()[0]
          .slice();
        const startCoords = coords.shift();
        const endCoords = coords.pop();

        startEndSource
          .getFeatureById("startPoint")
          .setGeometry(new Point(startCoords));
        startEndSource
          .getFeatureById("finishPoint")
          .setGeometry(new Point(endCoords));

        onSourceChange(true);
        this.setState({
          sourceLoaded: true
        });
      }
    });
  }

  toggleMarkers(show) {
    if (show) {
      const { gpxMarkers, startEndMarkers } = this.state;
      gpxMarkers.forEach(markerPoint =>
        this.gpxVectorLayer.getSource().addFeature(markerPoint)
      );
      startEndMarkers.forEach(markerPoint =>
        this.startEndVectorLayer.getSource().addFeature(markerPoint)
      );
    } else {
      const gpxMarkers = getPointFeatures(this.gpxVectorLayer);
      const startEndMarkers = getPointFeatures(this.startEndVectorLayer);
      this.setState({
        gpxMarkers,
        startEndMarkers
      });
      gpxMarkers.forEach(markerPoint =>
        this.gpxVectorLayer.getSource().removeFeature(markerPoint)
      );
      startEndMarkers.forEach(markerPoint =>
        this.startEndVectorLayer.getSource().removeFeature(markerPoint)
      );
    }
  }

  toggleRoute(show) {
    if (show) {
      const { multiLineFeature } = this.state;
      this.gpxVectorLayer.getSource().addFeature(multiLineFeature);
    } else {
      const multiLineFeature = getMultiLineStringFeature(this.gpxVectorLayer);
      this.setState({
        multiLineFeature
      });
      this.gpxVectorLayer.getSource().removeFeature(multiLineFeature);
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
  gpxUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  onSourceChange: PropTypes.func.isRequired,
  showMarkers: PropTypes.bool.isRequired,
  showRoute: PropTypes.bool.isRequired
};

export default GpxLayer;
