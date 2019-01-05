/* eslint-disable func-names */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "ol/ol.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import GPX from "ol/format/GPX";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";
import "./Map.css";
import "react-vis/dist/style.css";

import gpxData from "../../data/gr20-2018-complete-northsouth.gpx";

import ElevationProfile from "../ElevationProfile/ElevationProfile";

export const maps = [
  {
    name: "World_Imagery",
    url:
      "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  },
  {
    name: "Hybrid",
    url:
      "https://maps.tilehosting.com/styles/hybrid/{z}/{x}/{y}.jpg?key=D8rAgJ6CfH56RKjDGVLl"
  }
];

class MyMap extends React.Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.popupContainerRef = React.createRef();
    this.popupContentRef = React.createRef();
    this.state = {
      lat: 42.184207,
      lng: 9.1079,
      zoom: 9,
      popupContent: ""
    };
  }

  async componentDidMount() {
    const { lat, lng, zoom } = this.state;
    const { map: mapUrl } = this.props;

    const target = this.mapRef.current;

    const xyzSource = new OSM({
      url: mapUrl
    });

    this.xyzSource = xyzSource;

    const rasterLayer = new TileLayer({
      source: xyzSource
    });

    const style = {
      Point: new Style({
        image: new CircleStyle({
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

    const gpxsource = new VectorSource({
      url: gpxData,
      format: new GPX()
    });

    const vectorLayer = new VectorLayer({
      source: gpxsource,
      style(feature) {
        return style[feature.getGeometry().getType()];
      }
    });

    const view = new View({
      center: fromLonLat([lng, lat]),
      zoom
    });

    const container = this.popupContainerRef.current;

    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.overlay = overlay;

    const map = new Map({
      target,
      layers: [rasterLayer, vectorLayer],
      view,
      overlays: [overlay],
      renderer: "canvas"
    });

    gpxsource.once("change", evt => {
      if (evt.target.getState() === "ready") {
        this.setState({
          source: gpxsource
        });
      }
    });

    const displayFeatureInfo = function(pixel, evt) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, feature => {
        features.push(feature);
      });

      if (features.length > 0) {
        // const geometryLayout = features[0].getGeometry().getLayout();
        // const firstFeature = features[0];
        // const desc = firstFeature.get("desc");
        // const geometry = firstFeature.getGeometry();
        // const point = geometry.getClosestPoint(evt.coordinate);
        // const elevation = point[2];
        map.getTarget().style.cursor = "pointer";
      } else {
        map.getTarget().style.cursor = "";
      }
    };

    map.on("pointermove", evt => {
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel, evt);
    });

    map.on("click", evt => {
      const features = map.getFeaturesAtPixel(evt.pixel);
      if (features && features.length) {
        const { coordinate } = evt;

        const props = features[0].getProperties();
        const geometry = features[0].getGeometry();
        const lonLat = toLonLat(coordinate);
        const hdms = toStringHDMS(lonLat);
        const point = geometry.getClosestPoint(evt.coordinate);
        const elevation = point[2];

        this.setState(
          {
            popupContent: (
              <div>
                <h4>{props.name}</h4>
                <h4>{props.desc}</h4>
                <p>{Math.round(elevation)}m</p> <code>{hdms}</code>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1546681287448!6m8!1m7!1sCAoSLEFGMVFpcE1LOEkzb3FheWtHOVhFby1vQnlWeGpqZkQ2XzVKanlhMzdDdkJo!2m2!1d42.36211429999999!2d8.909091!3f292.889159142757!4f-17.229054098280898!5f0.8452963887718612"
                  width="400"
                  height="250"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )
          },
          () => {
            overlay.setPosition(coordinate);
          }
        );
      } else {
        this.onClosePopup();
      }
    });

    document.getElementById("popup-closer").onclick = this.onClosePopup;
  }

  componentDidUpdate() {
    const { map } = this.props;
    this.xyzSource.setUrl(map);
  }

  onClosePopup = () => {
    this.overlay.setPosition(undefined);
  };

  render() {
    const { source, popupContent } = this.state;
    return (
      <Fragment>
        <div id="popup" className="ol-popup" ref={this.popupContainerRef}>
          <button type="button" id="popup-closer" className="ol-popup-closer" />
          <div id="popup-content" ref={this.popupContentRef}>
            {popupContent}
          </div>
        </div>
        {!!source && <ElevationProfile source={source} />}
        <div ref={this.mapRef} className="Map" />
      </Fragment>
    );
  }
}

MyMap.propTypes = {
  map: PropTypes.string.isRequired
};
export default MyMap;
