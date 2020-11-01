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
  useRef,
  useState,
} from 'react';
import {
  getPointFeatures,
  getStartEndPointCoordIndexesForCoordinate,
  isGpxWayPoint,
  isMultiLineStringFeature,
} from '../../util/util';
import { GpxSource } from './GpxSource';
import selectedPin from './selected-pin.png';
import Icon from 'ol/style/Icon';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { getFeatureStyle } from './GpxLayerStyles';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

export interface GpxLayerProps {
  map: OLMap;
  gpxUrl: string;
  selectedFeature?: Feature<Point>;
  showMarkers: boolean;
  showRoute: boolean;
  showFeatureLabels?: boolean;
  onSourceReady: (vectorSource: VectorSource) => void;
  onSelectPointFeature: (feature?: Feature<Point>) => void;
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
    gpxUrl,
    showMarkers,
    showRoute,
    selectedFeature,
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
          declutter: false,
          source: new VectorSource(),
        }),
      []
    );

    const previousHighlight = useRef<number[]>([]);

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
            isMultiLineStringFeature
          );

          const highlightSource = highlightLayer.getSource();

          if (multilineStringFeature) {
            const [
              startIndex,
              endIndex,
            ] = getStartEndPointCoordIndexesForCoordinate(
              coordinate,
              multilineStringFeature,
              sortedPointFeatures
            );

            const coords = multilineStringFeature
              .getGeometry()
              .getCoordinates()[0];
            const highlightedCoordinates = coords.slice(startIndex, endIndex);
            if (
              previousHighlight.current[0] !== startIndex &&
              previousHighlight.current[1] !== endIndex
            ) {
              const featureStyle = new Style({
                stroke: new Stroke({
                  color: 'orange',
                  width: 4,
                }),
                zIndex: 0,
              });

              const feature = new Feature({
                geometry: new MultiLineString([highlightedCoordinates]),
                name: 'camera',
              });

              feature.setStyle(featureStyle);

              highlightSource.clear();
              highlightSource.addFeature(feature);
              previousHighlight.current = [startIndex, endIndex];
            }
          } else {
            previousHighlight.current = [];
            highlightSource.clear();
          }
          (map.getTarget() as HTMLDivElement).style.cursor =
            pointFeature || multilineStringFeature ? 'pointer' : '';
          if (pointFeature) {
            setHoveredFeature(pointFeature);
          } else if (hoveredFeature) {
            setHoveredFeature(undefined);
          }
        }
      },
      [highlightLayer, hoveredFeature, map, sortedPointFeatures]
    );

    const onMapClick = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
        const feature = features.find(isGpxWayPoint);
        if (feature) {
          evt.preventDefault();
        }
        onSelectPointFeature(feature);
      },
      [map, onSelectPointFeature]
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
        style.setZIndex(3);
        feature.setStyle(style);
      },
      [selectedFeature, showMarkers, showRoute]
    );

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
