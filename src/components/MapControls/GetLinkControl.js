import ButtonControl from '../ButtonControl/ButtonControl';
import { getLayerById } from '../../util/util';

export default class GetLinkControl extends ButtonControl {
  constructor(options) {
    super(options);
    this.element.firstChild.addEventListener(
      'click',
      this.onButtonCLick,
      false
    );
  }

  onButtonCLick = () => {
    const map = this.getMap();
    const gpxSource = getLayerById(map, 'gpxvectorlayer').getSource();
    const gpxUrl = gpxSource.getUrl();

    const tileLayerSource = getLayerById(map, 'osmtilelayer').getSource();
    const tileLayerUrl = tileLayerSource.getUrls()[0];

    const { origin, pathname } = new URL(window.location);

    const searchParams = new URLSearchParams();
    searchParams.append('route', gpxUrl);
    searchParams.append('layer', tileLayerUrl);

    const url = `${origin}${pathname}?${searchParams.toString()}`;

    window.location = url;
  };
}
