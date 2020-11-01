import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import yellowMarker from './baseline-location_on-24px-yellow.svg';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import GeometryType from 'ol/geom/GeometryType';
import { FeatureLike } from 'ol/Feature';

export const imageIcon = new Icon({
  anchor: [0.5, 1],
  src: yellowMarker,
});

export function getFeatureStyle(
  feature: FeatureLike,
  showLabel: boolean,
  showImage: boolean,
  showRoute: boolean,
  fontFamily = 'Calibri,sans-serif'
): Style {
  const { name } = feature.getProperties();
  const type = feature.getGeometry().getType();
  switch (type) {
    case GeometryType.POINT:
      const textStyleOpts = new Text({
        text: name,
        font: `bold 13px ${fontFamily}`,
        overflow: false,
        offsetY: -10,
        offsetX: 12,
        textAlign: 'left',
        fill: new Fill({
          color: '#fff',
        }),
        stroke: new Stroke({
          color: '#000',
          width: 1,
        }),
      });
      return new Style({
        image: showImage ? imageIcon : undefined,
        text: showLabel ? textStyleOpts : undefined,
        zIndex: 3,
      });
    case GeometryType.MULTI_LINE_STRING:
      const routeStyleOpts = {
        stroke: new Stroke({
          color: 'rgba(0,60,136)',
          width: 4,
        }),
        zIndex: 1,
      };
      return new Style(showRoute ? routeStyleOpts : undefined);
    default:
      throw new Error('No styles for ' + type.toString());
  }
}
