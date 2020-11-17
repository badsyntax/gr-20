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
  FeatureWithCoordIndex,
  getNextFeature,
  getPrevFeature,
  getSortedPointFeatureIndexes,
  getSortedPointFeatures,
} from '../../util/util';
import { GpxLayer } from '../GpxLayer/GpxLayer';
import { MapControls } from '../MapControls/MapControls';
import { TileLayer } from '../TileLayer/TileLayer';
import { useStyles } from './styles';
import { StartFinishLayer } from '../StartFinishLayer/StartFinishLayer';
import { Stage } from '../../util/types';
import { DetailDrawer } from '../DetailDrawer/DetailDrawer';
import { StageLayer } from '../StageLayer/StageLayer';

const initialState = {
  lat: 42.184207,
  lng: 9.1079,
  zoom: 10,
};

export const ANIMATION_DURATION = 250;

export const Map: React.FunctionComponent = ({ children }) => {
  const classes = useStyles();
  const mapRef = createRef<HTMLDivElement>();
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const [selectedStage, setSelectedStage] = useState<Stage>();
  const [sortedPointFeatures, setSortedPointFeatures] = useState<
    Feature<Point>[]
  >([]);
  const [sortedPointFeatureIndexes, setSortedPointFeatureIndexes] = useState<
    FeatureWithCoordIndex[]
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
    setSelectedStage(undefined);
  };

  const onSelectGpxPointFeature = (feature?: Feature<Point>) => {
    setSelectedStage(undefined);
    setSelectedFeature(feature);
  };

  const onSelectGpxStage = (stage: Stage) => {
    setSelectedFeature(undefined);
    setSelectedStage(stage);
  };

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
  }, [map, mapRef]);

  const onGpxSourceReady = useCallback((vectorSource: VectorSource) => {
    const sortedFeatures = getSortedPointFeatures(vectorSource);
    const sortedPointFeatureIndexes = getSortedPointFeatureIndexes(
      vectorSource,
      sortedFeatures
    );
    setSortedPointFeatures(sortedFeatures);
    setSortedPointFeatureIndexes(sortedPointFeatureIndexes);
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
      >
        {(gpxVectorLayer) => {
          return (
            <Fragment>
              {showControls && (
                <MapControls map={map} source={gpxVectorLayer.getSource()} />
              )}
              <StartFinishLayer
                map={map}
                gpxVectorLayer={gpxVectorLayer}
                showMarkers={showMarkers}
              />
            </Fragment>
          );
        }}
      </GpxLayer>
      <StageLayer
        map={map}
        sortedPointFeatures={sortedPointFeatures}
        sortedPointFeatureIndexes={sortedPointFeatureIndexes}
        selectedStage={selectedStage}
        onStageSelect={onSelectGpxStage}
      />
      <TileLayer map={map} mapUrl={mapUrl} />
      <DetailDrawer
        isOpen={Boolean(selectedFeature || selectedStage)}
        feature={selectedFeature}
        nextFeature={nextFeature}
        prevFeature={prevFeature}
        selectFeature={setSelectedFeature}
        onClose={onWaypointDrawerClose}
        map={map}
        sortedPointFeatures={sortedPointFeatures}
        stage={selectedStage}
      />
    </div>
  );
};
