import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { default as OLMap } from 'ol/Map';
import STATE from 'ol/source/State';
import VectorSource from 'ol/source/Vector';

import React, { memo, useCallback, useEffect, useMemo } from 'react';
import {
  START_POINT_ID,
  FINISH_POINT_ID,
  START_POINT_LABEL,
  FINISH_POINT_LABEL,
} from '../../util/constants';
import { getMultiLineStringFeature } from '../../util/util';
import { createPointTextFeature } from './util';

export interface StartFinishLayerProps {
  map: OLMap;
  gpxVectorLayer: VectorLayer;
  showMarkers: boolean;
}

export const StartFinishLayer: React.FunctionComponent<StartFinishLayerProps> = memo(
  ({ map, gpxVectorLayer, showMarkers }) => {
    const startEndVectorLayer = useMemo(() => new VectorLayer(), []);
    const startEndSource = useMemo(() => new VectorSource(), []);

    const toggleMarkers = useCallback(
      (show: boolean) => {
        startEndVectorLayer.setVisible(show);
      },
      [startEndVectorLayer]
    );

    const addFeatures = useCallback(
      (gpxVectorSource: VectorSource) => {
        const multiLineStringGeometry = getMultiLineStringFeature(
          gpxVectorSource.getFeatures()
        )?.getGeometry();
        if (!multiLineStringGeometry) {
          return;
        }
        const startFeature = createPointTextFeature(
          START_POINT_LABEL,
          START_POINT_ID,
          '#FFF'
        );
        startFeature.setGeometry(
          new Point(multiLineStringGeometry.getFirstCoordinate())
        );

        const endFeature = createPointTextFeature(
          FINISH_POINT_LABEL,
          FINISH_POINT_ID,
          '#FFF'
        );
        endFeature.setGeometry(
          new Point(multiLineStringGeometry.getLastCoordinate())
        );

        startEndSource.addFeatures([startFeature, endFeature]);
        toggleMarkers(true);
      },
      [startEndSource, toggleMarkers]
    );

    const onGpxVectorLayerStateChange = useCallback(() => {
      const gpxVectorSource = gpxVectorLayer.getSource();
      if (
        gpxVectorSource.getState() === STATE.READY &&
        gpxVectorSource.getFeatures().length
      ) {
        addFeatures(gpxVectorSource);
      }
    }, [addFeatures, gpxVectorLayer]);

    useEffect(() => {
      startEndVectorLayer.setSource(startEndSource);
    }, [startEndSource, startEndVectorLayer]);

    useEffect(() => {
      startEndVectorLayer.setZIndex(3);
      map.addLayer(startEndVectorLayer);
      return () => {
        map.removeLayer(startEndVectorLayer);
      };
    }, [map, startEndVectorLayer]);

    useEffect(() => {
      toggleMarkers(false);
      gpxVectorLayer.once('postrender', onGpxVectorLayerStateChange);
      return () => gpxVectorLayer.un('postrender', onGpxVectorLayerStateChange);
    }, [gpxVectorLayer, onGpxVectorLayerStateChange, toggleMarkers]);

    useEffect(() => {
      toggleMarkers(showMarkers);
    }, [showMarkers, toggleMarkers]);

    return null;
  }
);
