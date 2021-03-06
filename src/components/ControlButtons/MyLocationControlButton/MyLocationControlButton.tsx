import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { default as OLMap } from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { hideSpinner, showSpinner } from '../../../features/spinner';
import { getLayerById } from '../../../util/util';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import marker from './baseline-my_location-24px-yellow.svg';
import MyLocationIcon from '@material-ui/icons/MyLocation';
const LAYER_ID = 'mylocation_layer';
const FEATURE_ID = 'mylocation_feature';
const ANIMATION_DURATION = 1000;

export interface MyLocationControlButtonProps {
  map: OLMap;
}

export const MyLocationControlButton: React.FunctionComponent<
  MyLocationControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = ({ map, ...rest }) => {
  const dispatch = useDispatch();

  const feature = useMemo<Feature>(() => {
    const _feature = new Feature({
      name: 'My Location',
    });
    _feature.setId(FEATURE_ID);
    _feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: marker,
        }),
      })
    );
    return _feature;
  }, []);

  const vectorLayer = useMemo<VectorLayer>(() => {
    const _vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    });
    _vectorLayer.set('id', LAYER_ID);
    return _vectorLayer;
  }, [feature]);

  useEffect(() => {
    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [feature, vectorLayer, map]);

  const onGetCurrentPosition = (position: Position) => {
    dispatch(hideSpinner());

    const coords = fromLonLat([
      position.coords.longitude,
      position.coords.latitude,
    ]);

    vectorLayer
      .getSource()
      .getFeatureById(FEATURE_ID)
      .setGeometry(new Point(coords));

    map.getView().animate({
      center: coords,
      duration: ANIMATION_DURATION,
    });
  };

  const onButtonCLick = () => {
    if ('geolocation' in navigator) {
      dispatch(showSpinner());
      if (!getLayerById(map, LAYER_ID)) {
        map.addLayer(vectorLayer);
      }
      navigator.geolocation.getCurrentPosition(onGetCurrentPosition);
    } else {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported in your browser');
    }
  };

  return (
    <ControlButton onClick={onButtonCLick} {...rest}>
      <MyLocationIcon />
    </ControlButton>
  );
};
