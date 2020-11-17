import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { default as OLMap } from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { FeatureLike } from 'ol/Feature';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Stage } from '../../util/types';
import {
  FeatureWithCoordIndex,
  findMultiLineStringFeature,
  getStageForCoordinate,
  isGpxLayer,
  isGpxWayPoint,
} from '../../util/util';

import { GPX_LAYER_MULTILINE_FEATURE_ID } from '../GpxLayer/GpxSource';
import { getTextFeatureStyle, multilineStyle } from './StageLayerStyles';
import { Pixel } from 'ol/pixel';

export const STAGE_MULTILINE_ID = 'stage-layer';
export const STAGE_MULTILINE_ZINDEX = 2;
export const STAGE_TEXT_ZINDEX = 3;
export const STAGE_MULTILINE_FEATURE_ID = 'stage-multiline-feature';

export interface StageLayerProps {
  map: OLMap;
  sortedPointFeatures: Feature<Point>[];
  sortedPointFeatureIndexes: FeatureWithCoordIndex[];
  selectedStage?: Stage;
  onStageSelect: (stage: Stage) => void;
}

export const StageLayer: React.FunctionComponent<StageLayerProps> = memo(
  ({
    map,
    selectedStage,
    sortedPointFeatures,
    sortedPointFeatureIndexes,
    onStageSelect,
  }) => {
    const multilineFeature = useMemo<Feature>(() => {
      const feature = new Feature();
      feature.set('id', STAGE_MULTILINE_FEATURE_ID);
      feature.setStyle(multilineStyle);
      return feature;
    }, []);

    const multilineLayer = useMemo(() => {
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [multilineFeature],
        }),
        zIndex: STAGE_MULTILINE_ZINDEX,
      });
      vectorLayer.set('id', STAGE_MULTILINE_ID);
      return vectorLayer;
    }, [multilineFeature]);

    const textFeature = useMemo<Feature>(() => {
      const feature = new Feature();
      feature.set('id', STAGE_MULTILINE_FEATURE_ID);
      return feature;
    }, []);

    const textLayer = useMemo(
      () =>
        new VectorLayer({
          source: new VectorSource({
            features: [textFeature],
          }),
          zIndex: STAGE_TEXT_ZINDEX,
        }),
      [textFeature]
    );

    const showTextFeature = useCallback(
      (stage: Stage, pixel: Pixel) => {
        if (textLayer.getVisible()) {
          return;
        }
        const style = getTextFeatureStyle(
          'Stage 4 ' + stage.startFeature.getProperties().name
        );
        textFeature.setStyle(style);
        const coord = map.getCoordinateFromPixel(pixel);
        textFeature.setGeometry(new Point(coord));
        textLayer.setVisible(true);
      },
      [map, textFeature, textLayer]
    );

    const showStageMultilineFeature = useCallback(
      (stage: Stage) => {
        const gpxVectorLayer = map.getLayers().getArray().find(isGpxLayer);
        if (!gpxVectorLayer) {
          console.warn('GPX vector layer not found');
          return;
        }
        const features = gpxVectorLayer.getSource().getFeatures();
        const multilineStringFeature = features.find(
          findMultiLineStringFeature(GPX_LAYER_MULTILINE_FEATURE_ID)
        );
        if (!multilineStringFeature) {
          return;
        }
        multilineLayer.setVisible(true);
        const coords = multilineStringFeature.getGeometry().getCoordinates()[0];
        const highlightedCoordinates = coords.slice(
          stage.coordIndexes[0],
          stage.coordIndexes[1]
        );
        multilineFeature.setGeometry(
          new MultiLineString([highlightedCoordinates])
        );
      },
      [map, multilineFeature, multilineLayer]
    );

    const onMapPointerMove = useCallback(
      (evt: MapBrowserEvent<MouseEvent>) => {
        if (
          (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
          'canvas'
        ) {
          if (evt.dragging) {
            return;
          }
          const coordinate = map.getEventCoordinate(evt.originalEvent);
          const pixel = map.getEventPixel(evt.originalEvent);
          const features: FeatureLike[] = [];
          map.forEachFeatureAtPixel(
            pixel,
            (feature) => {
              features.push(feature);
            },
            { hitTolerance: 6 }
          );
          const pointFeature = features.find(isGpxWayPoint);

          const multilineStringFeature = features.find(
            findMultiLineStringFeature(GPX_LAYER_MULTILINE_FEATURE_ID)
          );

          (map.getTarget() as HTMLDivElement).style.cursor =
            pointFeature || multilineStringFeature ? 'pointer' : '';

          if ((pointFeature || !multilineStringFeature) && !selectedStage) {
            multilineLayer.setVisible(false);
            textLayer.setVisible(false);
          } else if (multilineStringFeature && sortedPointFeatures.length) {
            const stage = getStageForCoordinate(
              coordinate,
              multilineStringFeature,
              sortedPointFeatureIndexes
            );
            if (stage) {
              showStageMultilineFeature(stage);
              showTextFeature(stage, pixel);
            }
          }
        }
      },
      [
        map,
        multilineLayer,
        selectedStage,
        showStageMultilineFeature,
        showTextFeature,
        sortedPointFeatureIndexes,
        sortedPointFeatures.length,
        textLayer,
      ]
    );

    const onMapClick = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        const { coordinate } = evt;
        const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
        const multilineStringFeature = features.find(
          findMultiLineStringFeature(GPX_LAYER_MULTILINE_FEATURE_ID)
        );
        const pointFeature = features.find(isGpxWayPoint);

        if (!pointFeature && multilineStringFeature) {
          const stage = getStageForCoordinate(
            coordinate,
            multilineStringFeature,
            sortedPointFeatureIndexes
          );
          if (stage) {
            onStageSelect(stage);
          }
        }
      },
      [map, onStageSelect, sortedPointFeatureIndexes]
    );

    useEffect(() => {
      if (selectedStage) {
        showStageMultilineFeature(selectedStage);
      } else {
        multilineLayer.setVisible(false);
        textLayer.setVisible(false);
      }
    }, [multilineLayer, selectedStage, showStageMultilineFeature, textLayer]);

    useEffect(() => {
      map.addLayer(multilineLayer);
      map.addLayer(textLayer);
      return () => {
        map.removeLayer(multilineLayer);
        map.removeLayer(textLayer);
      };
    }, [map, multilineLayer, textLayer]);

    useEffect(() => {
      map.on(MapBrowserEventType.POINTERMOVE, onMapPointerMove);
      map.on(MapBrowserEventType.CLICK, onMapClick);
      return () => {
        map.un(MapBrowserEventType.POINTERMOVE, onMapPointerMove);
        map.un(MapBrowserEventType.CLICK, onMapClick);
      };
    }, [map, onMapClick, onMapPointerMove]);

    return null;
  }
);
