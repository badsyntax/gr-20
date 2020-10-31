import { Color } from 'ol/color';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';

export function createPointTextStyle(
  text: string,
  color: Color | string
): Style {
  return new Style({
    text: new Text({
      text,
      font: 'bold 13px Calibri,sans-serif',
      overflow: true,
      offsetY: 10,
      fill: new Fill({
        color: color,
      }),
      stroke: new Stroke({
        color: '#000',
        width: 1,
      }),
    }),
  });
}

export function createPointTextFeature(
  name: string,
  id: string,
  color: Color | string
): Feature {
  const feature = new Feature({
    name,
  });
  feature.setStyle(createPointTextStyle(name, color));
  feature.setId(id);
  return feature;
}
