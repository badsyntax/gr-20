/* eslint-disable react/no-unused-state */
import React, { Component } from "react";
import PropTypes from "prop-types";

const initialState = {
  isOpen: false
};
export const SpinnerContext = React.createContext();

class SpinnerProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      toggle: this.toggle
    };
  }

  toggle = show => {
    this.setState(({ isOpen }) => ({
      isOpen: show !== undefined ? show : !isOpen
    }));
  };

  render() {
    const { children } = this.props;
    return (
      <SpinnerContext.Provider value={this.state}>
        {children}
      </SpinnerContext.Provider>
    );
  }
}

SpinnerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default SpinnerProvider;
