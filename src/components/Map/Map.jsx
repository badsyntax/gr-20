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
import {
  defaults as defaultControls,
  Attribution,
  FullScreen
} from "ol/control";

import ZoomToExtent from "ol/control/ZoomToExtent";
import ScaleLine from "ol/control/ScaleLine";

import { fromLonLat } from "ol/proj";
import "./Map.css";
import "react-vis/dist/style.css";

import route1 from "../../data/routes/gr20-2018-complete-northsouth.gpx";
// import route2 from "../../data/routes/gr20-all.gpx";

import ElevationProfile from "../ElevationProfile/ElevationProfile";
import Popup from "../Popup/Popup";

import maps from "../../data/maps/maps";

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
      isPopupOpen: false,
      map: null,
      selectedPoint: null
    };
  }

  async componentDidMount() {
    const { lat, lng, zoom } = this.state;
    const { map: mapUrl } = this.props;

    const target = this.mapRef.current;

    const attribution = new Attribution({
      collapsible: true
    });

    const xyzSource = new OSM({
      url: mapUrl,
      attributions: [["© Acme Inc.", "© Bacme Inc."]]
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
      url: route1,
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

    const map = new Map({
      target,
      layers: [rasterLayer, vectorLayer],
      view,
      controls: defaultControls({ attribution: false }).extend([
        attribution,
        new FullScreen(),
        new ZoomToExtent({
          label: "H",
          extent: [
            978823.488305482,
            5121096.608475749,
            1039463.1111227559,
            5245134.752643153
          ]
        })
      ]),
      renderer: "canvas"
    });

    this.state.map = map;

    const scaleLine = new ScaleLine({
      units: "metric",
      minWidth: 100
    });

    map.addControl(scaleLine);

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
        map.getTarget().style.cursor = "pointer";
      } else {
        map.getTarget().style.cursor = "";
      }
    };

    map.on("pointermove", evt => {
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel, evt);
    });
  }

  componentDidUpdate() {
    const { map } = this.props;
    this.xyzSource.setUrl(map);
    const { attribution } = maps.filter(_map => _map.url === map)[0];
    this.xyzSource.setAttributions(attribution);
  }

  onClosePopup = () => {
    this.overlay.setPosition(undefined);
  };

  render() {
    const { source, map, selectedPoint, isPopupOpen } = this.state;
    const { showElevationProfile } = this.props;
    return (
      <Fragment>
        <div ref={this.mapRef} className="Map" />
        {map && source && (
          <Fragment>
            <Popup point={selectedPoint} map={map} isOpen={isPopupOpen} />
            {showElevationProfile && <ElevationProfile source={source} />}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

MyMap.propTypes = {
  map: PropTypes.string.isRequired,
  showElevationProfile: PropTypes.bool.isRequired
};
export default MyMap;
