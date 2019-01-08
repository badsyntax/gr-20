import React, { Component } from "react";
import Map from "ol/Map";
import PropTypes from "prop-types";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";

import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import { fromLonLat } from "ol/proj";
import MultiLineString from "ol/geom/MultiLineString";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
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
  })
};

class GpxLayer extends Component {
  constructor(props) {
    super(props);
    this.vectorLayer = new VectorLayer({
      style(feature) {
        return style[feature.getGeometry().getType()];
      }
    });
    this.state = {
      source: null,
      sourceLoaded: false
    };
  }

  componentDidMount() {
    const { map } = this.props;
    map.addLayer(this.vectorLayer);
    this.setSource();
  }

  componentDidUpdate(prevProps) {
    const { gpxUrl } = this.props;
    if (prevProps.gpxUrl !== gpxUrl) {
      this.setSource();
    }
  }

  async setSource() {
    const { onSourceChange, gpxUrl } = this.props;

    onSourceChange(false);
    this.setState({
      sourceLoaded: false
    });

    const vectorSource = new VectorSource();

    const fetchStart = window.performance.now();
    const response = await fetch(gpxUrl);
    const responseText = await response.text();

    console.log(
      "It took %dms to fetch the GPX track",
      window.performance.now() - fetchStart
    );

    const xmlParseStart = window.performance.now();

    const responseDoc = new DOMParser().parseFromString(
      responseText,
      "application/xml"
    );

    const trk = responseDoc.getElementsByTagName("trk")[0];
    const trkseg = trk.getElementsByTagName("trkseg")[0];
    const trkpt = trkseg.getElementsByTagName("trkpt");
    const wpt = responseDoc.getElementsByTagName("wpt");
    const metadata = responseDoc.getElementsByTagName("metadata")[0];
    const trackName = metadata
      .getElementsByTagName("name")[0]
      .textContent.trim();

    // console.log("wpt", wpt);
    [...wpt].forEach(wayPoint => {
      const lon = parseFloat(wayPoint.getAttribute("lon"));
      const lat = parseFloat(wayPoint.getAttribute("lat"));
      const ele = parseFloat(
        wayPoint.getElementsByTagName("ele")[0].textContent.trim()
      );
      const name = wayPoint.getElementsByTagName("name")[0].textContent.trim();
      const wayPointGeom = new Point(fromLonLat([lon, lat, ele]));

      const wayPointFeature = new Feature({
        geometry: wayPointGeom,
        name
      });

      wayPointFeature.setStyle(
        new Style({
          image: new Circle({
            fill: new Fill({
              color: "yellow"
            }),
            radius: 5,
            stroke: new Stroke({
              color: "#ff0",
              width: 1
            })
          })
        })
      );

      vectorSource.addFeature(wayPointFeature);
    });

    const coords = [...trkpt].map(point => [
      parseFloat(point.getAttribute("lon")),
      parseFloat(point.getAttribute("lat")),
      parseFloat(point.getElementsByTagName("ele")[0].textContent.trim())
    ]);

    const startPointGeom = new Point(fromLonLat(coords[0]));
    const endPointGeom = new Point(fromLonLat(coords[coords.length - 1]));

    const sampleSize = 1;
    const sampedCoords = coords.filter(
      (coord, index) => index % sampleSize === 0
    );

    const points = sampedCoords.map((coord, index) =>
      sampedCoords.slice(index, index + 2)
    );

    console.log(
      "It took %dms to parse and sample the GPX track (%d data points)",
      window.performance.now() - xmlParseStart,
      points.length
    );

    const multiLineStart = window.performance.now();
    const multiline = new MultiLineString(points).transform(
      "EPSG:4326",
      "EPSG:3857"
    );

    const multiLineFeature = new Feature({
      geometry: multiline,
      name: trackName
    });

    multiLineFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(0,60,136)",
          width: 4
        })
      })
    );

    const startPointFeature = new Feature({
      geometry: startPointGeom,
      name: "Start Point"
    });

    startPointFeature.setStyle(
      new Style({
        image: new Circle({
          fill: new Fill({
            color: "green"
          }),
          radius: 5,
          stroke: new Stroke({
            color: "#ff0",
            width: 1
          })
        })
      })
    );

    const endPointFeature = new Feature({
      geometry: endPointGeom,
      name: "End Point"
    });

    endPointFeature.setStyle(
      new Style({
        image: new Circle({
          fill: new Fill({
            color: "red"
          }),
          radius: 5,
          stroke: new Stroke({
            color: "#ff0",
            width: 1
          })
        })
      })
    );

    vectorSource.addFeature(multiLineFeature);
    vectorSource.addFeature(startPointFeature);
    vectorSource.addFeature(endPointFeature);

    this.vectorLayer.setSource(vectorSource);

    console.log(
      "It took %dms to init the MultiLineString",
      window.performance.now() - multiLineStart
    );

    onSourceChange(true);
    this.setState({
      sourceLoaded: true,
      source: vectorSource
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
