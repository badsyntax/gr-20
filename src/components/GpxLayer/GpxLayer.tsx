import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { default as OLMap } from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, {
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getPointFeatures,
  getStartEndPointCoordIndexesForCoordinate,
  isGpxWayPoint,
  findMultiLineStringFeature,
} from '../../util/util';
import { GpxSource } from './GpxSource';
import selectedPin from './selected-pin.png';
import Icon from 'ol/style/Icon';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { getFeatureStyle } from './GpxLayerStyles';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { Stage } from '../../util/types';

export interface GpxLayerProps {
  map: OLMap;
  gpxUrl: string;
  selectedFeature?: Feature<Point>;
  selectedStage?: Stage;
  showMarkers: boolean;
  showRoute: boolean;
  showFeatureLabels?: boolean;
  onSourceReady: (vectorSource: VectorSource) => void;
  onSelectPointFeature: (feature?: Feature<Point>) => void;
  onSelectStage: (stage: Stage) => void;
  sortedPointFeatures: Feature<Point>[];
  children: (
    gpxVectorLayer: VectorLayer,
    multiLineStringFeature?: Feature<MultiLineString>
  ) => ReactNode;
}

export const GpxLayer: React.FunctionComponent<GpxLayerProps> = memo(
  ({
    map,
    onSourceReady,
    onSelectPointFeature,
    onSelectStage,
    gpxUrl,
    showMarkers,
    showRoute,
    selectedFeature,
    selectedStage = [],
    children,
    sortedPointFeatures,
    showFeatureLabels = false,
  }) => {
    const [gpxMarkers, setGpxMarkers] = useState<Feature<Geometry>[]>([]);
    const [hoveredFeature, setHoveredFeature] = useState<Feature<Point>>();

    const vectorLayer = useMemo(
      () =>
        new VectorLayer({
          declutter: false,
        }),
      []
    );

    const highlightLayer = useMemo(
      () =>
        new VectorLayer({
          source: new VectorSource(),
        }),
      []
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
          const pointFeature = features.find(isGpxWayPoint);

          const multilineStringFeature = features.find(
            findMultiLineStringFeature('gpx-multiline-feature')
          );

          (map.getTarget() as HTMLDivElement).style.cursor =
            pointFeature || multilineStringFeature ? 'pointer' : '';
          if (pointFeature) {
            setHoveredFeature(pointFeature);
          } else if (hoveredFeature) {
            setHoveredFeature(undefined);
          }

          if (multilineStringFeature) {
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
              return;
            }
            onSelectStage([start, end]);
          } else if (selectedStage.length) {
            onSelectStage([]);
          }
        }
      },
      [
        hoveredFeature,
        map,
        onSelectStage,
        selectedStage.length,
        sortedPointFeatures,
      ]
    );

    const onMapClick = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        const { coordinate } = evt;
        const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
        const pointFeature = features.find(isGpxWayPoint);
        const multilineStringFeature = features.find(
          findMultiLineStringFeature('gpx-multiline-feature')
        );
        if (pointFeature || multilineStringFeature) {
          evt.preventDefault();
        }
        if (pointFeature) {
          onSelectPointFeature(pointFeature);
        } else if (multilineStringFeature) {
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
            return;
          }
          onSelectStage([start, end]);
        } else {
          onSelectPointFeature(undefined);
        }
      },
      [map, onSelectPointFeature, onSelectStage, sortedPointFeatures]
    );

    const onReady = useCallback(
      (vectorSource: VectorSource) => {
        onSourceReady(vectorSource);
        const features = vectorSource.getFeatures();
        setGpxMarkers(getPointFeatures(features));
      },
      [onSourceReady]
    );

    const resetPoints = useCallback(() => {
      gpxMarkers.forEach((feature) => {
        if (selectedFeature !== feature) {
          feature.setStyle(
            getFeatureStyle(feature, showFeatureLabels, showMarkers, showRoute)
          );
        }
      });
    }, [
      gpxMarkers,
      selectedFeature,
      showFeatureLabels,
      showMarkers,
      showRoute,
    ]);

    const setHoveredOrSelectedStyle = useCallback(
      (feature: Feature<Point>) => {
        const isSelectedFeature = feature === selectedFeature;
        const style = getFeatureStyle(feature, true, showMarkers, showRoute);
        if (isSelectedFeature) {
          style.setImage(
            new Icon({
              anchor: [0.5, 1],
              src: selectedPin,
            })
          );
        }
        style.setZIndex(2);
        feature.setStyle(style);
      },
      [selectedFeature, showMarkers, showRoute]
    );

    useEffect(() => {
      const source = highlightLayer.getSource();
      source.clear();
      if (!selectedStage.length) {
        return;
      }
      const features = vectorLayer.getSource().getFeatures();
      const multilineStringFeature = features.find(
        findMultiLineStringFeature('gpx-multiline-feature')
      );
      if (multilineStringFeature) {
        const coords = multilineStringFeature.getGeometry().getCoordinates()[0];
        const highlightedCoordinates = coords.slice(
          selectedStage[0],
          selectedStage[1]
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
    }, [highlightLayer, selectedStage, vectorLayer]);

    useEffect(() => {
      vectorLayer.setStyle((feature) => {
        return getFeatureStyle(
          feature,
          showFeatureLabels,
          showMarkers,
          showRoute
        );
      });
    }, [showFeatureLabels, showMarkers, showRoute, vectorLayer]);

    useEffect(() => {
      highlightLayer.set('id', 'highlight-layer');
      vectorLayer.set('id', 'gpx-vector-layer');

      vectorLayer.setZIndex(1);
      highlightLayer.setZIndex(2);

      map.addLayer(vectorLayer);
      map.addLayer(highlightLayer);
    }, [highlightLayer, map, vectorLayer]);

    useEffect(() => {
      if (!selectedFeature) {
        return;
      }
      resetPoints();
      setHoveredOrSelectedStyle(selectedFeature);
    }, [resetPoints, selectedFeature, setHoveredOrSelectedStyle]);

    useEffect(() => {
      if (!hoveredFeature) {
        resetPoints();
        return;
      }
      setHoveredOrSelectedStyle(hoveredFeature);
    }, [hoveredFeature, resetPoints, setHoveredOrSelectedStyle]);

    useEffect(() => {
      map.on(MapBrowserEventType.POINTERMOVE, onMapPointerMove);
      map.on(MapBrowserEventType.CLICK, onMapClick);
      return () => {
        map.un(MapBrowserEventType.POINTERMOVE, onMapPointerMove);
        map.un(MapBrowserEventType.CLICK, onMapClick);
      };
    }, [map, onMapClick, onMapPointerMove]);

    return (
      <Fragment>
        <GpxSource
          gpxUrl={gpxUrl}
          vectorLayer={vectorLayer}
          onReady={onReady}
        />
        {children && children(vectorLayer)}
      </Fragment>
    );
  }
);
