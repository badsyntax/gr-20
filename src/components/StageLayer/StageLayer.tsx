import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { default as OLMap } from 'ol/Map';
import { Feature, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';
import MultiLineString from 'ol/geom/MultiLineString';
import { Stage } from '../../util/types';
import {
  getStartEndPointCoordIndexesForCoordinate,
  findMultiLineStringFeature,
  isGpxLayer,
} from '../../util/util';
import Point from 'ol/geom/Point';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

export interface StageLayerProps {
  map: OLMap;
  sortedPointFeatures: Feature<Point>[];
}

export const StageLayer: React.FunctionComponent<StageLayerProps> = memo(
  ({ map, sortedPointFeatures }) => {
    const [hoveredStage, setHoveredStage] = useState<Stage>([]);

    const stageLayer = useMemo(
      () =>
        new VectorLayer({
          source: new VectorSource(),
        }),
      []
    );

    const getStage = useCallback(
      (
        coordinate: Coordinate,
        multilineStringFeature: Feature<MultiLineString>
      ): Stage => {
        const [start, end] = getStartEndPointCoordIndexesForCoordinate(
          coordinate,
          multilineStringFeature,
          sortedPointFeatures
        );
        if (
          start === undefined ||
          start === -1 ||
          end === undefined ||
          end === -1
        ) {
          return [];
        }
        return [start, end];
      },
      [sortedPointFeatures]
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
            { hitTolerance: 4 }
          );
          const multilineStringFeature = features.find(
            findMultiLineStringFeature('gpx-multiline-feature')
          );

          (map.getTarget() as HTMLDivElement).style.cursor = multilineStringFeature
            ? 'pointer'
            : '';

          if (multilineStringFeature) {
            const stage = getStage(coordinate, multilineStringFeature);
            if (stage.length) {
              console.log('hovered stagte');
              setHoveredStage(stage);
            }
          } else if (hoveredStage.length) {
            setHoveredStage([]);
          }
        }
      },
      [getStage, hoveredStage.length, map]
    );

    const onMapClick = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        const { coordinate } = evt;
        const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
        const multilineStringFeature = features.find(
          findMultiLineStringFeature('gpx-multiline-feature')
        );
        if (multilineStringFeature) {
          const stage = getStage(coordinate, multilineStringFeature);
          if (stage.length) {
            alert('select stage');
          }
        }
      },
      [getStage, map]
    );

    useEffect(() => {
      const source = stageLayer.getSource();
      source.clear();
      if (!hoveredStage.length) {
        return;
      }
      const vectorLayer = map.getLayers().getArray().find(isGpxLayer);
      if (!vectorLayer) {
        return;
      }
      const features = vectorLayer.getSource().getFeatures();
      const multilineStringFeature = features.find(
        findMultiLineStringFeature('gpx-multiline-feature')
      );
      if (multilineStringFeature) {
        const coords = multilineStringFeature.getGeometry().getCoordinates()[0];
        const highlightedCoordinates = coords.slice(
          hoveredStage[0],
          hoveredStage[1]
        );
        const style = new Style({
          stroke: new Stroke({
            color: 'orange',
            width: 4,
          }),
        });
        const feature = new Feature();
        feature.setGeometry(new MultiLineString([highlightedCoordinates]));
        feature.set('id', 'highlight-multiline-feature');
        feature.setStyle(style);
        source.addFeature(feature);
      }
    }, [hoveredStage, map, stageLayer]);

    useEffect(() => {
      stageLayer.set('id', 'stage-layer');
      stageLayer.setZIndex(2);

      map.addLayer(stageLayer);

      return () => {
        map.removeLayer(stageLayer);
      };
    }, [map, stageLayer]);

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
