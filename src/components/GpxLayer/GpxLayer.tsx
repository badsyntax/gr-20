import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import MultiLineString from 'ol/geom/MultiLineString';
import { Vector as VectorLayer } from 'ol/layer';
import { default as OLMap } from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, {
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getMultiLineStringFeature, getPointFeatures } from '../../util/util';
import { GpxSource } from './GpxSource';
import { styles } from './styles';

const vectorLayer = new VectorLayer();
vectorLayer.set('id', 'gpx-vector-layer');
vectorLayer.setStyle((feature) => {
  const type = feature.getGeometry().getType().toString();
  return styles[type];
});

export interface GpxLayerProps {
  map: OLMap;
  gpxUrl: string;
  showMarkers: boolean;
  showRoute: boolean;
  onSourceReady: (vectorSource: VectorSource) => void;
  children: (
    gpxVectorLayer: VectorLayer,
    multiLineStringFeature?: Feature<MultiLineString>
  ) => ReactNode;
}

export const GpxLayer: React.FunctionComponent<GpxLayerProps> = memo(
  ({ map, onSourceReady, gpxUrl, showMarkers, showRoute, children }) => {
    const [gpxMarkers, setGpxMarkers] = useState<Feature<Geometry>[]>([]);
    const [multiLineStringFeature, setMultiLineStringFeature] = useState<
      Feature<MultiLineString>
    >();

    const toggleMarkers = useCallback(
      (show: boolean) => {
        const source = vectorLayer.getSource();
        if (show) {
          if (!getPointFeatures(source.getFeatures()).length) {
            gpxMarkers.forEach((markerPoint) => {
              source.addFeature(markerPoint);
            });
          }
        } else {
          gpxMarkers.forEach((markerPoint) =>
            source.removeFeature(markerPoint)
          );
        }
      },
      [gpxMarkers]
    );

    const toggleRoute = useCallback(
      (show: boolean) => {
        if (!multiLineStringFeature) {
          return;
        }
        if (show) {
          const source = vectorLayer.getSource();
          if (!getMultiLineStringFeature(source.getFeatures())) {
            vectorLayer.getSource().addFeature(multiLineStringFeature);
          }
        } else {
          vectorLayer.getSource().removeFeature(multiLineStringFeature);
        }
      },
      [multiLineStringFeature]
    );

    const onReady = useCallback(
      (vectorSource: VectorSource) => {
        onSourceReady(vectorSource);
        const features = vectorSource.getFeatures();
        setGpxMarkers(getPointFeatures(features));
        setMultiLineStringFeature(getMultiLineStringFeature(features));
      },
      [onSourceReady]
    );

    useEffect(() => {
      map.addLayer(vectorLayer);
    }, [map]);

    useEffect(() => {
      toggleMarkers(showMarkers);
    }, [showMarkers, toggleMarkers]);

    useEffect(() => {
      toggleRoute(showRoute);
    }, [showRoute, toggleRoute]);

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
