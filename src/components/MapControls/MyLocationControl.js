import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';

import { getLayerById } from '../../util/util';
import ButtonControl from './ButtonControl';

import marker from './baseline-my_location-24px-yellow.svg';

const LAYER_ID = 'mylocation_layer';
const FEATURE_ID = 'mylocation_feature';

export default class MyLocationControl extends ButtonControl {
  constructor(options) {
    super(options);

    const feature = new Feature({
      name: 'My Location',
    });
    feature.setId(FEATURE_ID);
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: marker,
        }),
      })
    );

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    });
    this.vectorLayer.set('id', LAYER_ID);

    this.element.firstChild.addEventListener(
      'click',
      this.onButtonCLick,
      false
    );
  }

  setLoadingFunc(loadingFunc) {
    this.loadingFunc = loadingFunc;
  }

  getLoadingFunc() {
    return this.loadingFunc;
  }

  isLoading(isLoading) {
    return this.getLoadingFunc()(isLoading);
  }

  onButtonCLick = () => {
    if ('geolocation' in navigator) {
      const map = this.getMap();
      this.isLoading(true);
      if (!getLayerById(map, LAYER_ID)) {
        map.addLayer(this.vectorLayer);
      }
      navigator.geolocation.getCurrentPosition(this.onGetCurrentPosition);
    } else {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported in your browser');
    }
  };

  onGetCurrentPosition = position => {
    this.isLoading(false);
    const coords = fromLonLat([
      position.coords.longitude,
      position.coords.latitude,
    ]);

    this.getMap()
      .getView()
      .setCenter(coords);

    this.vectorLayer
      .getSource()
      .getFeatureById(FEATURE_ID)
      .setGeometry(new Point(coords));
  };
}
