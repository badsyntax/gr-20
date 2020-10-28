// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import { Vector as VectorLayer } from 'ol/layer';
// import Map from 'ol/Map';
// import STATE from 'ol/source/State';
// import VectorSource from 'ol/source/Vector';
// import Fill from 'ol/style/Fill';
// import Icon from 'ol/style/Icon';
// import Stroke from 'ol/style/Stroke';
// import Style from 'ol/style/Style';
// import Text from 'ol/style/Text';
// import PropTypes from 'prop-types';
// import React, { Component } from 'react';
// import { getLayerById, getMultiLineStringFeature } from '../../util/util';
// import { MapContext } from '../Map/Map';
// import { OptionsContext } from '../Options/OptionsProvider';
// import yellowMarker from './baseline-location_on-24px-yellow.svg';

// const pointTextStyle = (text, marker, color) =>
//   new Style({
//     image: new Icon({
//       anchor: [0.5, 1],
//       src: marker,
//     }),
//     text: new Text({
//       text,
//       fill: new Fill({ color }),
//       stroke: new Stroke({ color: '#ffffff', width: 2 }),
//       font: 'bold 13px Arial',
//       offsetY: 12,
//     }),
//   });

// const createPointTextFeature = (name, id, color, marker) => {
//   const feature = new Feature({
//     name,
//   });
//   feature.setId(id);
//   feature.setStyle(pointTextStyle(name, marker, color));
//   return feature;
// };

// class StartEndLayer extends Component {
//   constructor(props) {
//     super(props);
//     this.vectorLayer = new VectorLayer();
//   }

//   componentDidMount() {
//     const { map } = this.props;
//     map.addLayer(this.vectorLayer);
//     this.setLayerSource();
//   }

//   componentDidUpdate(prevProps) {
//     const { showMarkers, gpxUrl } = this.props;
//     if (prevProps.showMarkers !== showMarkers) {
//       this.showMarkers(showMarkers);
//     }
//     if (prevProps.gpxUrl !== gpxUrl) {
//       this.setLayerSource();
//     }
//   }

//   setLayerSource() {
//     const { map } = this.props;
//     this.showMarkers(false);
//     const gpxVectorLayer = getLayerById(map, 'gpxvectorlayer');

//     const source = new VectorSource();
//     source.addFeature(
//       createPointTextFeature(
//         'Start',
//         'startPoint',
//         'rgba(0,60,136)',
//         yellowMarker
//       )
//     );
//     source.addFeature(
//       createPointTextFeature(
//         'Finish',
//         'finishPoint',
//         'rgba(0,60,136)',
//         yellowMarker
//       )
//     );
//     this.vectorLayer.setSource(source);

//     gpxVectorLayer.getSource().once('change', (evt) => {
//       if (gpxVectorLayer.getSource().getState() === STATE.READY) {
//         const multiLineStringGeometry = getMultiLineStringFeature(
//           gpxVectorLayer.getSource().getFeatures()
//         ).getGeometry();
//         source
//           .getFeatureById('startPoint')
//           .setGeometry(new Point(multiLineStringGeometry.getFirstCoordinate()));
//         source
//           .getFeatureById('finishPoint')
//           .setGeometry(new Point(multiLineStringGeometry.getLastCoordinate()));
//         this.showMarkers(true);
//       }
//     });
//   }

//   showMarkers(show) {
//     this.vectorLayer.setVisible(show);
//   }

//   render() {
//     return null;
//   }
// }

// StartEndLayer.propTypes = {
//   map: PropTypes.instanceOf(Map).isRequired,
//   showMarkers: PropTypes.bool.isRequired,
//   gpxUrl: PropTypes.string.isRequired,
// };

// const StartEndLayerContainer = (props) => (
//   <OptionsContext.Consumer>
//     {({ values }) => {
//       const { showMarkers, gpxUrl } = values;
//       return (
//         <MapContext.Consumer>
//           {({ map }) => (
//             <StartEndLayer
//               map={map}
//               showMarkers={showMarkers}
//               gpxUrl={gpxUrl}
//               {...props}
//             />
//           )}
//         </MapContext.Consumer>
//       );
//     }}
//   </OptionsContext.Consumer>
// );

// export default StartEndLayerContainer;
