import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form as ReactStrapForm } from 'reactstrap';

class Form extends Component {
  onChange = ({ target }) => {
    const { onChange } = this.props;
    const { name, type, checked, value: targetValue } = target;
    const value = type === 'checkbox' ? checked : targetValue;
    onChange(name, value);
  };

  render() {
    const { children } = this.props;
    return <ReactStrapForm onChange={this.onChange}>{children}</ReactStrapForm>;
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Form;
