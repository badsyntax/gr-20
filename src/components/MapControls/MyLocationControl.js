import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import ButtonControl from './ButtonControl';

import marker from './baseline-my_location-24px-yellow.svg';

export default class MyLocationControl extends ButtonControl {
  constructor(options) {
    super(options);

    const feature = new Feature({
      name: 'My Location',
    });
    feature.setId('mylocation');
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: marker,
        }),
      })
    );

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    });
    this.vectorLayer.set('id', 'mylocation');

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

  onButtonCLick = () => {
    if ('geolocation' in navigator) {
      const map = this.getMap();
      this.getLoadingFunc()(true);
      if (
        !map
          .getLayers()
          .getArray()
          .find(layer => layer.get('id') === 'mylocation')
      ) {
        map.addLayer(this.vectorLayer);
      }
      navigator.geolocation.getCurrentPosition(this.onGetCurrentPosition);
    } else {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported in your browser');
    }
  };

  onGetCurrentPosition = position => {
    this.getLoadingFunc()(false);
    const coords = fromLonLat([
      position.coords.longitude,
      position.coords.latitude,
    ]);

    this.getMap()
      .getView()
      .setCenter(coords);

    this.vectorLayer
      .getSource()
      .getFeatureById('mylocation')
      .setGeometry(new Point(coords));
  };
}
