import { Component } from 'react';
import Map from 'ol/Map';
import PropTypes from 'prop-types';
import OSM from 'ol/source/OSM';
import Tile from 'ol/layer/Tile';

class TileLayer extends Component {
  componentDidMount() {
    const { map, mapUrl } = this.props;
    this.xyzSource = new OSM({
      url: mapUrl,
    });
    const rasterLayer = new Tile({
      source: this.xyzSource,
    });
    map.addLayer(rasterLayer);
  }

  componentDidUpdate() {
    const { mapUrl } = this.props;
    this.xyzSource.setUrl(mapUrl);
  }

  render() {
    return null;
  }
}

TileLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  mapUrl: PropTypes.string.isRequired,
};

export default TileLayer;
