import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { default as OLMap } from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { FeatureLike } from 'ol/Feature';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';

import { Stage } from '../../util/types';
import {
  findMultiLineStringFeature,
  getStageForCoordinate,
  isGpxLayer,
  isGpxWayPoint,
} from '../../util/util';

import { GPX_LAYER_MULTILINE_FEATURE_ID } from '../GpxLayer/GpxSource';

export const STAGE_MULTILINE_ID = 'stage-layer';
export const STAGE_MULTILINE_ZINDEX = 2;
export const STAGE_TEXT_ZINDEX = 3;
export const STAGE_MULTILINE_FEATURE_ID = 'stage-multiline-feature';

export interface StageLayerProps {
  map: OLMap;
  sortedPointFeatures: Feature<Point>[];
}

const multilineStyle = new Style({
  stroke: new Stroke({
    color: 'orange',
    width: 4,
  }),
});

function getFeatureStyle(
  name: string,
  fontFamily = 'Calibri,sans-serif'
): Style {
  const textStyleOpts = new Text({
    text: name,
    font: `bold 13px ${fontFamily}`,
    overflow: false,
    offsetY: 8,
    offsetX: 14,
    textAlign: 'left',
    fill: new Fill({
      color: '#fff',
    }),
    stroke: new Stroke({
      color: '#000',
      width: 1,
    }),
  });
  const style = new Style({
    text: textStyleOpts,
  });
  return style;
}

export const StageLayer: React.FunctionComponent<StageLayerProps> = memo(
  ({ map, sortedPointFeatures }) => {
    const [hoveredStage, setHoveredStage] = useState<Stage>();

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

    const onMapPointerMove = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        if (
          (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
          'canvas'
        ) {
          const { coordinate } = evt;
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

          // disable all features when hovering over a waypoint
          if (pointFeature) {
            if (hoveredStage) {
              setHoveredStage(undefined);
              textLayer.setVisible(false);
            }
          }
          // if a stage is found then set it in stage
          else if (multilineStringFeature && sortedPointFeatures.length) {
            const stage = getStageForCoordinate(
              coordinate,
              multilineStringFeature,
              sortedPointFeatures
            );
            if (
              stage &&
              stage.coordIndexes[0] !== hoveredStage?.coordIndexes[0] &&
              stage.coordIndexes[1] !== hoveredStage?.coordIndexes[1]
            ) {
              setHoveredStage(stage);
              const style = getFeatureStyle(
                'Stage 4 ' + stage.startFeature.getProperties().name
              );
              textFeature.setStyle(style);
              const coord = map.getCoordinateFromPixel(pixel);
              textFeature.setGeometry(new Point(coord));
              textLayer.setVisible(true);
            }
          }
          // if no stage is found then remove the current stage in state
          else if (hoveredStage) {
            setHoveredStage(undefined);
            textLayer.setVisible(false);
          }
        }
      },
      [hoveredStage, map, sortedPointFeatures, textFeature, textLayer]
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
            sortedPointFeatures
          );
          if (stage) {
            alert('select stage');
          }
        }
      },
      [map, sortedPointFeatures]
    );

    useEffect(() => {
      if (!hoveredStage) {
        multilineLayer.setVisible(false);
        return;
      }
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
        hoveredStage.coordIndexes[0],
        hoveredStage.coordIndexes[1]
      );

      multilineFeature.setGeometry(
        new MultiLineString([highlightedCoordinates])
      );
    }, [hoveredStage, map, multilineFeature, multilineLayer]);

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
