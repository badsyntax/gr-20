import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

export function getTextFeatureStyle(
  name: string,
  fontFamily = 'Calibri,sans-serif'
): Style {
  const textStyleOpts = new Text({
    text: name,
    font: `bold 13px ${fontFamily}`,
    overflow: false,
    offsetY: 8,
    offsetX: 14,
    textAlign: 'left',
    fill: new Fill({
      color: '#fff',
    }),
    stroke: new Stroke({
      color: '#000',
      width: 1,
    }),
  });
  const style = new Style({
    text: textStyleOpts,
  });
  return style;
}

export const multilineStyle = new Style({
  stroke: new Stroke({
    color: 'orange',
    width: 4,
  }),
});
