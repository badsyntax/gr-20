// import sync from 'ol-hashed';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { default as OLMap } from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, {
  createRef,
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
import { TileLayer } from '../TileLayer/TileLayer';
// import { Popover } from '../Popover/Popover';
import { useStyles } from './styles';
import { WaypointDrawer } from '../WaypointDrawer/WaypointDrawer';
import { StartFinishLayer } from '../StartFinishLayer/StartFinishLayer';
import { Stage } from '../../util/types';

const initialState = {
  lat: 42.184207,
  lng: 9.1079,
  zoom: 10,
};

export const ANIMATION_DURATION = 250;

export const Map: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  const mapRef = createRef<HTMLDivElement>();
  const [isWaypointDrawerOpen, setIsWaypointDrawerOpen] = useState<boolean>(
    false
  );

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const [selectedStage, setSelectedStage] = useState<Stage>();
  const [sortedPointFeatures, setSortedPointFeatures] = useState<
    Feature<Point>[]
  >([]);
  const {
    mapUrl,
    gpxUrl,
    showControls,
    showMarkers,
    showRoute,
    showFeatureLabels,
  } = useSelector((state: RootState) => state.settings);

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

  const onWaypointDrawerClose = () => {
    setSelectedFeature(undefined);
    setIsWaypointDrawerOpen(false);
  };

  const onSelectGpxPointFeature = useCallback((feature?: Feature<Point>) => {
    setSelectedFeature(feature);
    setIsWaypointDrawerOpen(!!feature);
  }, []);

  const onSelectGpxStage = useCallback((stage: Stage) => {
    setSelectedStage(stage);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGpxSourceReady = useCallback((vectorSource: VectorSource) => {
    const sortedFeatures = getSortedPointFeatures(vectorSource);
    setSortedPointFeatures(sortedFeatures);
  }, []);

  // useEffect(() => {
  //   const coordinates = selectedFeature?.getGeometry().getCoordinates();
  //   if (coordinates) {
  //     map.getView().animate({
  //       center: coordinates,
  //       duration: ANIMATION_DURATION,
  //     });
  //   }
  // }, [map, selectedFeature]);

  return (
    <div className={classes.root} ref={mapRef}>
      <GpxLayer
        gpxUrl={gpxUrl}
        sortedPointFeatures={sortedPointFeatures}
        showMarkers={showMarkers}
        showRoute={showRoute}
        showFeatureLabels={showFeatureLabels}
        onSourceReady={onGpxSourceReady}
        map={map}
        onSelectPointFeature={onSelectGpxPointFeature}
        onSelectStage={onSelectGpxStage}
        selectedFeature={selectedFeature}
        selectedStage={selectedStage}
      >
        {(gpxVectorLayer) => {
          return (
            <Fragment>
              {selectedFeature && (
                <WaypointDrawer
                  isOpen={isWaypointDrawerOpen}
                  feature={selectedFeature}
                  nextFeature={nextFeature}
                  prevFeature={prevFeature}
                  selectFeature={setSelectedFeature}
                  onClose={onWaypointDrawerClose}
                  map={map}
                  gpxVectorLayer={gpxVectorLayer}
                />
              )}
              {showControls && (
                <MapControls map={map} source={gpxVectorLayer.getSource()} />
              )}
              <StartFinishLayer
                map={map}
                gpxVectorLayer={gpxVectorLayer}
                showMarkers={showMarkers}
              />

              {/* {hoveredFeature && (
                <Popover
                  map={map}
                  feature={hoveredFeature}
                  isOpen={isPopoverOpen}
                  setIsOpen={setIsPopoverOpen}
                />
              )} */}
            </Fragment>
          );
        }}
      </GpxLayer>
      <TileLayer map={map} mapUrl={mapUrl} />
    </div>
  );
};
