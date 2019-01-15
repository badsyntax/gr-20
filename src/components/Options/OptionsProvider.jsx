import React, { Component } from 'react';
import PropTypes from 'prop-types';

import dropdownOptions from './dropdownOptions';

const initialState = {
  values: {
    gpxUrl: null,
    mapUrl: null,
    showElevationProfile: false,
    showControls: true,
    showMarkers: true,
    showRoute: true,
  },
  dropdownOptions,
};
export const OptionsContext = React.createContext(initialState);

class OptionsProvider extends Component {
  constructor(props) {
    super(props);
    const state = {
      ...initialState,
      onChange: this.onChange,
    };
    Object.assign(state.values, props.values);
    this.state = state;
  }

  onChange = (name, value) => {
    this.setState(({ values }) => ({
      values: {
        ...values,
        [name]: value,
      },
    }));
  };

  render() {
    const { children } = this.props;
    return (
      <OptionsContext.Provider value={this.state}>
        {children}
      </OptionsContext.Provider>
    );
  }
}

OptionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  values: PropTypes.shape().isRequired,
};

export default OptionsProvider;
