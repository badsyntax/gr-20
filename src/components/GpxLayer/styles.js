import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

const styles = {
  Point: new Style({
    image: new Circle({
      fill: new Fill({
        color: 'rgb(255,255,0,1)',
      }),
      stroke: new Stroke({ color: 'rgba(0,60,136)', width: 1 }),
      radius: 5,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: 'rgba(0,60,136)',
      width: 4,
    }),
  }),
};

export default styles;
