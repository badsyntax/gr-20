import React, { Component } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

import STYLES from './ButtonControl.module.scss';

const c = classNames.bind(STYLES);

class ControlButton extends Component {
  state = {
    tooltipOpen: false,
  };

  buttonRef = React.createRef();

  toggleTooltip = () => {
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen,
    }));
  };

  render() {
    const { tooltipOpen } = this.state;
    const { children, className, tooltip, ...rest } = this.props;
    return (
      <div className={c(STYLES.ButtonControl__container, className)}>
        <button
          className={STYLES.ButtonControl}
          type="button"
          ref={this.buttonRef}
          {...rest}
        >
          {children}
        </button>
        {tooltip && this.buttonRef.current && (
          <Tooltip
            placement="bottom"
            isOpen={tooltipOpen}
            target={this.buttonRef.current}
            toggle={this.toggleTooltip}
            delay={{ show: 0, hide: 0 }}
          >
            {tooltip}
          </Tooltip>
        )}
      </div>
    );
  }
}

ControlButton.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string,
};

ControlButton.defaultProps = {
  className: null,
  tooltip: null,
};

export default ControlButton;
