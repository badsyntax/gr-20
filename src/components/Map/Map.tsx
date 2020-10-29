// import sync from 'ol-hashed';
import Feature, { FeatureLike } from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import Point from 'ol/geom/Point';
import { default as OLMap } from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import {
  FINISH_POINT_ID,
  StartEndLayer,
  START_POINT_ID,
} from '../StartEndLayer/StartEndLayer';
import { TileLayer } from '../TileLayer/TileLayer';
import STYLES from './Map.module.scss';
import 'ol/ol.css';

const initialState = {
  lat: 42.184207,
  lng: 9.1079,
  zoom: 9,
};

const pointSelectEvents = [MapBrowserEventType.POINTERDOWN];

function isGpxWayPoint(feature: FeatureLike) {
  return (
    feature.getGeometry().getType() === GeometryType.POINT &&
    feature.getId() !== START_POINT_ID &&
    feature.getId() !== FINISH_POINT_ID
  );
}

export const Map: React.FunctionComponent = ({ children }) => {
  const mapRef = React.createRef<HTMLDivElement>();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const [sortedPointFeatures, setSortedPointFeatures] = useState<
    Feature<Point>[]
  >();
  const { mapUrl, gpxUrl, showControls, showMarkers, showRoute } = useSelector(
    (state: RootState) => state.settings
  );

  const map = useMemo<OLMap>(
    () =>
      new OLMap({
        pixelRatio: 1,
        controls: [],
      }),
    []
  );

  const nextFeature =
    selectedFeature &&
    sortedPointFeatures &&
    getNextFeature(selectedFeature, sortedPointFeatures);

  const prevFeature =
    selectedFeature &&
    sortedPointFeatures &&
    getPrevFeature(selectedFeature, sortedPointFeatures);

  const onPopupClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const onMapPointerMove = (evt: MapBrowserEvent<UIEvent>) => {
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
  };

  const onMapClick = (evt: MapBrowserEvent<UIEvent>) => {
    const features = map.getFeaturesAtPixel(evt.pixel, { hitTolerance: 4 });
    if (features && features.length) {
      const feature = features.find(isGpxWayPoint);
      if (feature) {
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

  const onGpxSourceReady = useCallback((vectorSource: VectorSource) => {
    const sortedFeatures = getSortedPointFeatures(vectorSource);
    setSortedPointFeatures(sortedFeatures);
  }, []);

  return (
    <div className={STYLES.Map} ref={mapRef}>
      <GpxLayer
        gpxUrl={gpxUrl}
        showMarkers={showMarkers}
        showRoute={showRoute}
        onSourceReady={onGpxSourceReady}
        map={map}
      >
        {(gpxVectorLayer) => {
          return (
            <Fragment>
              {showControls && (
                <MapControls map={map} source={gpxVectorLayer.getSource()} />
              )}
              <StartEndLayer
                map={map}
                gpxVectorLayer={gpxVectorLayer}
                showMarkers={showMarkers}
                gpxUrl={gpxUrl}
              />
              {selectedFeature && (
                <Popup
                  map={map}
                  gpxVectorLayer={gpxVectorLayer}
                  feature={selectedFeature}
                  nextFeature={nextFeature}
                  prevFeature={prevFeature}
                  isOpen={isPopupOpen}
                  onClose={onPopupClose}
                  selectFeature={selectFeature}
                />
              )}
            </Fragment>
          );
        }}
      </GpxLayer>
      <TileLayer map={map} mapUrl={mapUrl} />
    </div>
  );
};
