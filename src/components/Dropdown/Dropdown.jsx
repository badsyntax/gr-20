import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown } from 'reactstrap';

class Dropdown extends Component {
  state = {
    isOpen: false,
  };

  toggle = name => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  onMouseEnter = () => {
    this.setState({
      isOpen: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { isOpen } = this.state;
    const { children } = this.props;
    return (
      <ButtonDropdown
        isOpen={isOpen}
        toggle={this.toggle}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {children}
      </ButtonDropdown>
    );
  }
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dropdown;
