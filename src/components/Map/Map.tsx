// import sync from 'ol-hashed';
import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { default as OLMap } from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  getNextFeature,
  getPrevFeature,
  getSortedPointFeatures,
} from '../../util/util';
import { GpxLayer } from '../GpxLayer/GpxLayer';
import { MapControls } from '../MapControls/MapControls';
import { Popup } from '../Popup/Popup';
import { TileLayer } from '../TileLayer/TileLayer';
import STYLES from './Map.module.scss';

const initialState = {
  lat: 42.184207,
  lng: 9.1079,
  zoom: 9,
};

const pointSelectEvents = [MapBrowserEventType.POINTERDOWN];

export const Map: React.FunctionComponent = ({ children }) => {
  const mapRef = React.createRef<HTMLDivElement>();
  const [gpxVectorLayer, setGpxVectorLayer] = useState<VectorLayer>();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const [sortedPointFeatures, setSortedPointFeatures] = useState<
    Feature<Point>[]
  >();
  const { mapUrl } = useSelector((state: RootState) => state.settings);

  const map = useMemo<OLMap>(
    () =>
      new OLMap({
        pixelRatio: 1,
        controls: [],
      }),
    []
  );

  const onPopupClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const onMapPointerMove = (evt: MapBrowserEvent<UIEvent>) => {
    if (
      (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
      'canvas'
    ) {
      const pixel = map.getEventPixel(evt.originalEvent);
      const features = [];
      map.forEachFeatureAtPixel(pixel, (feature) => {
        features.push(feature);
      });
      if (features.length > 0) {
        (map.getTarget() as HTMLDivElement).style.cursor = 'pointer';
      } else {
        (map.getTarget() as HTMLDivElement).style.cursor = '';
      }
    }
  };

  const onMapClick = (evt: MapBrowserEvent<UIEvent>) => {
    const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
    if (features && features.length) {
      const [feature] = features;
      if (feature.getGeometry().getType() === GeometryType.POINT) {
        evt.preventDefault();
        setSelectedFeature(feature as Feature<Point>);
        setIsPopupOpen(true);
      }
    } else if (
      (evt.originalEvent?.target as HTMLElement).nodeName.toLowerCase() ===
      'canvas'
    ) {
      setIsPopupOpen(false);
    }
  };

  const selectFeature = useCallback((feature: Feature<Point>) => {
    setSelectedFeature(feature);
  }, []);

  useEffect(() => {
    const { lat, lng, zoom } = initialState;
    const target = mapRef.current;
    if (target) {
      const view = new View({
        center: fromLonLat([lng, lat]),
        zoom,
      });
      map.setTarget(target);
      map.setView(view);
      map.on('pointermove', onMapPointerMove);
    }

    pointSelectEvents.forEach((eventType) => map.on(eventType, onMapClick));
    return () => {
      if (target) {
        map.un('pointermove', onMapPointerMove);
      }
      pointSelectEvents.forEach((eventType) => map.un(eventType, onMapClick));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLayerReady = useCallback((vectorLayer: VectorLayer) => {
    setGpxVectorLayer(vectorLayer);
  }, []);

  const onSourceReady = useCallback((vectorSource: VectorSource) => {
    const sortedFeatures = getSortedPointFeatures(vectorSource);
    setSortedPointFeatures(sortedFeatures);
  }, []);

  const source = gpxVectorLayer?.getSource();

  return (
    <div className={STYLES.Map} ref={mapRef}>
      <GpxLayer
        map={map}
        onLayerReady={onLayerReady}
        onSourceReady={onSourceReady}
      />
      <TileLayer map={map} mapUrl={mapUrl} />
      {gpxVectorLayer && selectedFeature && sortedPointFeatures && (
        <Popup
          map={map}
          gpxVectorLayer={gpxVectorLayer}
          feature={selectedFeature}
          nextFeature={getNextFeature(selectedFeature, sortedPointFeatures)}
          prevFeature={getPrevFeature(selectedFeature, sortedPointFeatures)}
          isOpen={isPopupOpen}
          onClose={onPopupClose}
          selectFeature={selectFeature}
        />
      )}
      {source && <MapControls map={map} source={source} />}
    </div>
  );
};
