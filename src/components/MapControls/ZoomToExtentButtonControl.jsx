import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from 'ol/Map';
import { MdFullscreen } from 'react-icons/md';

import ButtonControl from '../ButtonControl/ButtonControl';

class ZoomToExtentButtonControl extends Component {
  onButtonCLick = () => {
    const { map } = this.props;
    const view = map.getView();
    view.fit([
      978823.488305482,
      5121096.608475749,
      1039463.1111227559,
      5245134.752643153,
    ]);
  };

  render() {
    const { map, vectorLayer, ...rest } = this.props;
    return (
      <ButtonControl
        tooltipPlacement="right"
        onClick={this.onButtonCLick}
        {...rest}
      >
        <MdFullscreen />
      </ButtonControl>
    );
  }
}

ZoomToExtentButtonControl.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
};

export default ZoomToExtentButtonControl;
