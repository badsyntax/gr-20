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

import startIcon from "./marker-gold.png";

const createFeature = (name, id, color) => {
  const feature = new Feature({
    name
  });
  feature.setId(id);
  feature.setStyle(
    new Style({
      // image: new Circle({
      //   fill: new Fill({
      //     color
      //   }),
      //   radius: 5
      // }),
      image: new Icon({
        anchor: [0.5, 1],
        src: startIcon
        // size: "50px"
      }),
      text: new Text({
        text: name,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
        font: "bold 13px Arial",
        offsetY: 12
      })
    })
  );
  return feature;
};

const getMultiLineStringFeature = features =>
  features.find(
    feature => feature.getGeometry().getType() === "MultiLineString"
  );

const style = {
  Point: new Style({
    // image: new Icon({
    //   src: startIcon
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
  constructor(props) {
    super(props);
    this.gpxVectorLayer = new VectorLayer({
      style(feature) {
        return style[feature.getGeometry().getType()];
      }
    });
    this.startEndVectorLayer = new VectorLayer();
    this.state = {
      source: null,
      sourceLoaded: false
    };
  }

  componentDidMount() {
    const { map } = this.props;
    map.addLayer(this.gpxVectorLayer);
    map.addLayer(this.startEndVectorLayer);

    this.setSource();
  }

  componentDidUpdate(prevProps) {
    const { gpxUrl } = this.props;
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSource();
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
        createFeature("Start Point", "startPoint", "rgba(0,60,136)"),
        createFeature("End Point", "endPoint", "rgba(0,60,136)")
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
        const multiLineString = getMultiLineStringFeature(source.getFeatures());
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
          .getFeatureById("endPoint")
          .setGeometry(new Point(endCoords));

        onSourceChange(true);
        this.setState({
          sourceLoaded: true
        });
      }
    });
  }

  render() {
    const { source, sourceLoaded } = this.state;
    const { showElevationProfile } = this.props;
    return sourceLoaded && showElevationProfile ? (
      <ElevationProfile source={source} />
    ) : null;
  }
}

GpxLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  gpxUrl: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired,
  onSourceChange: PropTypes.func.isRequired
};

export default GpxLayer;
