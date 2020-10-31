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
import { getPointFeatures, isGpxWayPoint } from '../../util/util';
import { GpxSource } from './GpxSource';
import selectedPin from './selected-pin.png';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { getFeatureStyle } from './GpxLayerStyles';

export interface GpxLayerProps {
  map: OLMap;
  gpxUrl: string;
  selectedFeature?: Feature<Point>;
  showMarkers: boolean;
  showRoute: boolean;
  showFeatureLabels?: boolean;
  onSourceReady: (vectorSource: VectorSource) => void;
  onSelectPointFeature: (feature?: Feature<Point>) => void;
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
    showFeatureLabels = false,
  }) => {
    const [gpxMarkers, setGpxMarkers] = useState<Feature<Geometry>[]>([]);

    const vectorLayer = useMemo(
      () =>
        new VectorLayer({
          declutter: false,
        }),
      []
    );

    const onMapPointerMove = useCallback(
      (evt: MapBrowserEvent<UIEvent>) => {
        if (
          (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
          'canvas'
        ) {
          const pixel = map.getEventPixel(evt.originalEvent);
          const features: FeatureLike[] = [];
          map.forEachFeatureAtPixel(pixel, (feature) => {
            features.push(feature);
          });
          const pointFeature = features.find(isGpxWayPoint);
          (map.getTarget() as HTMLDivElement).style.cursor = pointFeature
            ? 'pointer'
            : '';
        }
      },
      [map]
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
    }, [map, vectorLayer]);

    useEffect(() => {
      gpxMarkers.forEach((feature) => {
        feature.setStyle(
          getFeatureStyle(feature, showFeatureLabels, showMarkers, showRoute)
        );
      });
      (selectedFeature?.getStyle() as Style)?.setImage(
        new Icon({
          anchor: [0.5, 1],
          src: selectedPin,
        })
      );
      (selectedFeature?.getStyle() as Style)?.setZIndex(3);
    }, [
      gpxMarkers,
      map,
      selectedFeature,
      showFeatureLabels,
      showMarkers,
      showRoute,
    ]);

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
