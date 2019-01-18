import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { MdLink } from 'react-icons/md';
import { getLayerById } from '../../util/util';

import ButtonControl from '../ButtonControl/ButtonControl';

class GetLinkButtonControl extends Component {
  onButtonCLick = () => {
    const { map } = this.props;

    const gpxSource = getLayerById(map, 'gpxvectorlayer').getSource();
    const gpxUrl = gpxSource.getUrl();

    const tileLayerSource = getLayerById(map, 'osmtilelayer').getSource();
    const tileLayerUrl = tileLayerSource.getUrls()[0];

    const { origin, pathname, hash } = new URL(window.location);

    const searchParams = new URLSearchParams();
    searchParams.append('route', gpxUrl);
    searchParams.append('layer', tileLayerUrl);

    const url = `${origin}${pathname}?${searchParams.toString()}${hash}`;

    window.location = url;
  };

  render() {
    const { map, showSpinner, vectorLayer, ...rest } = this.props;
    return (
      <ButtonControl onClick={this.onButtonCLick} {...rest}>
        <MdLink />
      </ButtonControl>
    );
  }
}

GetLinkButtonControl.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

export default GetLinkButtonControl;
