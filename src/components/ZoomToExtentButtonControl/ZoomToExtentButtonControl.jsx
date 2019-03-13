import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { MdZoomOutMap } from 'react-icons/md';

import ButtonControl from '../ButtonControl/ButtonControl';

const ANIMATION_DURATION = 1000;

class ZoomToExtentButtonControl extends Component {
  onButtonCLick = () => {
    const { map } = this.props;
    const view = map.getView();
    view.fit(
      [
        978823.488305482,
        5121096.608475749,
        1039463.1111227559,
        5245134.752643153,
      ],
      {
        duration: ANIMATION_DURATION,
      }
    );
  };

  render() {
    const { map, vectorLayer, ...rest } = this.props;
    return (
      <ButtonControl
        tooltipPlacement="right"
        onClick={this.onButtonCLick}
        {...rest}
      >
        <MdZoomOutMap />
      </ButtonControl>
    );
  }
}

ZoomToExtentButtonControl.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

export default ZoomToExtentButtonControl;
