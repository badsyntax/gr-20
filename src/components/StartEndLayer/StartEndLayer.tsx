import { Color } from 'ol/color';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import STATE from 'ol/source/State';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import React, { memo, useEffect, useRef } from 'react';
import { getMultiLineStringFeature } from '../../util/util';
import yellowMarker from './baseline-location_on-24px-yellow.svg';

const pointTextStyle = (text: string, marker: string, color: Color | string) =>
  new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: marker,
    }),
    text: new Text({
      text,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
      font: 'bold 13px Arial',
      offsetY: 12,
    }),
  });

const createPointTextFeature = (
  name: string,
  id: string,
  color: Color | string,
  marker: string
) => {
  const feature = new Feature({
    name,
  });
  feature.setStyle(pointTextStyle(name, marker, color));
  feature.setId(id);
  return feature;
};

export interface StartEndLayerProps {
  map: Map;
  gpxVectorLayer: VectorLayer;
  gpxUrl: string;
  showMarkers: boolean;
}

export const START_POINT_ID = 'startPoint';
export const FINISH_POINT_ID = 'finishPoint';

export const StartEndLayer: React.FunctionComponent<StartEndLayerProps> = memo(
  ({ map, gpxVectorLayer, gpxUrl, showMarkers }) => {
    const startEndVectorLayer = useRef<VectorLayer>();

    const toggleMarkers = (show: boolean) => {
      startEndVectorLayer.current?.setVisible(show);
    };

    const onGpxVectorLayerStateChange = () => {
      const gpxVectorSource = gpxVectorLayer.getSource();
      if (
        gpxVectorSource.getState() === STATE.READY &&
        gpxVectorSource.getFeatures().length
      ) {
        const multiLineStringGeometry = getMultiLineStringFeature(
          gpxVectorSource.getFeatures()
        )?.getGeometry();
        if (!multiLineStringGeometry) {
          return;
        }
        const startFeature = createPointTextFeature(
          'Start',
          START_POINT_ID,
          'rgba(0,60,136)',
          yellowMarker
        );
        startFeature.setGeometry(
          new Point(multiLineStringGeometry.getFirstCoordinate())
        );

        const endFeature = createPointTextFeature(
          'Finish',
          FINISH_POINT_ID,
          'rgba(0,60,136)',
          yellowMarker
        );
        endFeature.setGeometry(
          new Point(multiLineStringGeometry.getLastCoordinate())
        );

        const startEndSource = new VectorSource({
          features: [startFeature, endFeature],
        });

        startEndVectorLayer.current?.setSource(startEndSource);
        toggleMarkers(true);
      }
    };

    useEffect(() => {
      startEndVectorLayer.current = new VectorLayer();
      startEndVectorLayer.current.setZIndex(2);
      map.addLayer(startEndVectorLayer.current);
      return () => {
        if (startEndVectorLayer.current) {
          map.removeLayer(startEndVectorLayer.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      toggleMarkers(false);
      gpxVectorLayer.once('change', onGpxVectorLayerStateChange);
      return () => {
        gpxVectorLayer.un('change', onGpxVectorLayerStateChange);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gpxUrl]);

    useEffect(() => {
      toggleMarkers(showMarkers);
    }, [showMarkers]);

    return null;
  }
);
