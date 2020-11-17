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
  findMultiLineStringFeature,
  getPointFeatures,
  isGpxWayPoint,
} from '../../util/util';
import { GpxSource, GPX_LAYER_MULTILINE_FEATURE_ID } from './GpxSource';
import selectedPin from './selected-pin.png';
import Icon from 'ol/style/Icon';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { getFeatureStyle } from './GpxLayerStyles';
import { Stage } from '../../util/types';

export const GPX_LAYER_ID = 'gpx-vector-layer';
export const GPX_LAYER_ZINDEX = 1;

export interface GpxLayerProps {
  map: OLMap;
  gpxUrl: string;
  selectedFeature?: Feature<Point>;
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
    children,
    sortedPointFeatures,
    showFeatureLabels = false,
  }) => {
    const [gpxMarkers, setGpxMarkers] = useState<Feature<Geometry>[]>([]);
    const [hoveredFeature, setHoveredFeature] = useState<Feature<Point>>();

    const gpxVectorLayer = useMemo(() => {
      const vectorLayer = new VectorLayer({
        declutter: false,
      });
      vectorLayer.set('id', GPX_LAYER_ID);
      vectorLayer.setZIndex(GPX_LAYER_ZINDEX);
      return vectorLayer;
    }, []);

    const onMapPointerMove = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        if (
          (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
          'canvas'
        ) {
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
            findMultiLineStringFeature(GPX_LAYER_MULTILINE_FEATURE_ID)
          );
          (map.getTarget() as HTMLDivElement).style.cursor =
            pointFeature || multilineStringFeature ? 'pointer' : '';

          if (pointFeature && hoveredFeature !== pointFeature) {
            setHoveredFeature(pointFeature);
          } else if (hoveredFeature && !pointFeature) {
            setHoveredFeature(undefined);
          }
        }
      },
      [hoveredFeature, map]
    );

    const onMapClick = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
        const pointFeature = features.find(isGpxWayPoint);
        if (pointFeature) {
          onSelectPointFeature(pointFeature);
        } else {
          onSelectPointFeature(undefined);
        }
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
        feature.setStyle(style);
      },
      [selectedFeature, showMarkers, showRoute]
    );

    useEffect(() => {
      gpxVectorLayer.setStyle((feature) => {
        return getFeatureStyle(
          feature,
          showFeatureLabels,
          showMarkers,
          showRoute
        );
      });
    }, [showFeatureLabels, showMarkers, showRoute, gpxVectorLayer]);

    useEffect(() => {
      if (!selectedFeature) {
        return;
      }
      resetPoints();
      setHoveredOrSelectedStyle(selectedFeature);
    }, [resetPoints, selectedFeature, setHoveredOrSelectedStyle]);

    useEffect(() => {
      resetPoints();
      if (!hoveredFeature) {
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

    useEffect(() => {
      map.addLayer(gpxVectorLayer);
      return () => {
        map.removeLayer(gpxVectorLayer);
      };
    }, [map, gpxVectorLayer]);

    return (
      <Fragment>
        <GpxSource
          gpxUrl={gpxUrl}
          vectorLayer={gpxVectorLayer}
          onReady={onReady}
        />
        {children && children(gpxVectorLayer)}
      </Fragment>
    );
  }
);
