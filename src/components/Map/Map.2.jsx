/* eslint-disable func-names */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "ol/ol.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import GPX from "ol/format/GPX";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";

import Cluster from "ol/source/Cluster";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import { toStringHDMS } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";
import "./Map.css";
import "react-vis/dist/style.css";

import GeometryLayout from "ol/geom/GeometryLayout";
import MultiLineString from "ol/geom/MultiLineString";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";
import route from "./route.json";

import gpxData from "./gr20-2018-complete-northsouth.gpx";

import ElevationProfile from "../ElevationProfile/ElevationProfile";

// import Profil from 'ol-ext/'

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
      popupContent: "",
      graphdata: [],
      value: null,
      barX: 0
    };
  }

  componentDidUpdate(props) {
    this.xyzSource.setUrl(this.props.map);
  }

  async componentDidMount() {
    const { lat, lng, zoom } = this.state;
    const { map } = this.props;

    const target = this.mapRef.current;

    const xyzSource = new OSM({
      url: map
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
      format: new GPX({
        // readExtensions: f => console.log('F', f)
      })
    });

    const gpx = await fetch(gpxData);
    const gpxText = await gpx.text();

    const gpxTextXML = new DOMParser().parseFromString(
      gpxText,
      "application/xml"
    );
    const trk = gpxTextXML.getElementsByTagName("trk")[0];
    const trkSeg = trk.getElementsByTagName("trkseg")[0];
    const trkpts = trkSeg.getElementsByTagName("trkpt");

    // const coords = [...trkpts].map(trkptNode => [
    //   parseFloat(trkptNode.getAttribute('lat')),
    //   parseFloat(trkptNode.getAttribute('lon')),
    // ]);

    // console.log('COORDS', coords[0]);
    /* .concat(
        [parseFloat(trkptNode.getElementsByTagName('ele')[0].textContent)]) */

    // const coords2 = [
    //   {
    //     lon: 8.798487,
    //     lat: 42.559295,
    //   },
    //   {
    //     lon: 8.793175,
    //     lat: 42.554829
    //   }
    // ].map(trkptNode => fromLonLat([
    //   trkptNode.lon,
    //   trkptNode.lat
    // ], 'EPSG:3857', 'EPSG:4326'));

    // console.log('coords', coords.slice(0, 4));

    // const points = [];

    // coords.forEach((coord, index) => {
    //   // points.push([coord, coord]);
    //   if (index % 2 === 0) {
    //     //   // console.log('index', index);
    //     //   // if (index === 0) {
    //     // console.log('coords.slice(index, index + 2)', coords.slice(index, index + 2))
    //     points.push(coords.slice(index, index + 2))
    //     //   // } else {
    //     //   // points.push(coords.slice(index - 1, index + 1))
    //     //   // }
    //   }
    // });

    // // console.log('points', points);

    // const points2 = [
    //   [[102.0, 0.0, 1], [103.0, 1.0, 2], [104.0, 0.0, 3], [105.0, 1.0, 4]],
    //   [[105.0, 3.0, 1], [106.0, 4.0, 2], [107.0, 3.0, 3], [108.0, 4.0, 4]]
    // ]

    // new MultiLineString([
    // [[102.0, 0.0, 1], [103.0, 1.0, 2], [104.0, 0.0, 3], [105.0, 1.0, 4]],
    // [[105.0, 3.0, 1], [106.0, 4.0, 2], [107.0, 3.0, 3], [108.0, 4.0, 4]]
    // ], 'XYZ')

    // [
    //   [103.986498, 1.353864],
    //   [103.988247, 1.358454]
    // ]
    // ];

    // console.log('point2', points2);
    // const multiline = new MultiLineString([coords]).transform('EPSG:4326', 'EPSG:3857');

    // const feature1 = new Feature({
    //   geometry: multiline,
    // });

    // const source = new VectorSource({
    //   features: [feature1]
    // })

    // const clusterSource = new Cluster({
    //   distance: 1,
    //   source
    // });

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

    /**
     * Elements that make up the popup.
     */
    const container = this.popupContainerRef.current;
    const content = this.popupContentRef.current;
    // const closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
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
        const geometryLayout = features[0].getGeometry().getLayout();

        // debugger;

        // switch (geometryLayout) {
        //   case GeometryLayout.XYZM:
        //     if (coordinate[3] !== 0) {
        //       properties['time'] = coordinate[3];
        //     }
        //   // fall through
        //   case GeometryLayout.XYZ:
        //     if (coordinate[2] !== 0) {
        //       properties['ele'] = coordinate[2];
        //     }
        //     break;
        //   case GeometryLayout.XYM:
        //     if (coordinate[2] !== 0) {
        //       properties['time'] = coordinate[2];
        //     }
        //     break;
        //   default:
        //   // pass
        // }

        const firstFeature = features[0];
        const desc = firstFeature.get("desc");
        const geometry = firstFeature.getGeometry();

        const point = geometry.getClosestPoint(evt.coordinate);

        const elevation = point[2];

        // console.log("elevation", elevation);

        // console.log('desc', desc)
        // console.log('coords', coords)
        map.getTarget().style.cursor = "pointer";
      } else {
        map.getTarget().style.cursor = "";
      }
    };

    // New profil in the map
    // const profil = new Profil();
    // map.addControl(profil);

    map.on("pointermove", evt => {
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel, evt);
    });

    map.on("click", evt => {
      const start = Date.now();
      const features = map.getFeaturesAtPixel(evt.pixel);
      // console.log("click");
      if (features && features.length) {
        const props = features[0].getProperties();
        const geometry = features[0].getGeometry();

        const { coordinate } = evt;

        const lonLat = toLonLat(coordinate);
        const hdms = toStringHDMS(lonLat);

        const point = features[0].getGeometry().getClosestPoint(evt.coordinate);

        const elevation = point[2];

        // console.log("elevation2", elevation);

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
            // console.log("set");
          }
        );
      } else {
        this.onClosePopup();
      }
    });

    // map.on('click', (evt) => {
    //   displayFeatureInfo(evt.pixel, evt);
    // });

    document.getElementById("popup-closer").onclick = this.onClosePopup;
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
