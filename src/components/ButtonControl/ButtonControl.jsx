import React, { Component } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

import STYLES from './ButtonControl.module.scss';

const c = classNames.bind(STYLES);

class ButtonControl extends Component {
  state = {
    tooltipOpen: false,
  };

  buttonRef = React.createRef();

  componentDidMount() {
    const { onClick } = this.props;
    this.buttonRef.current.addEventListener('click', onClick);
  }

  componentWillUnmount() {
    const { onClick } = this.props;
    this.buttonRef.current.removeEventListener('click', onClick);
  }

  toggleTooltip = () => {
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen,
    }));
  };

  render() {
    const { tooltipOpen } = this.state;
    const {
      children,
      className,
      tooltip,
      tooltipPlacement,
      onClick,
      buttonClassName,
      ...rest
    } = this.props;
    return (
      <div className={c(STYLES.ButtonControl__container, className)}>
        <button
          className={c(STYLES.ButtonControl, buttonClassName)}
          type="button"
          ref={this.buttonRef}
          {...rest}
        >
          {children}
        </button>
        {tooltip && this.buttonRef.current && (
          <Tooltip
            placement={tooltipPlacement}
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

ButtonControl.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  tooltip: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ButtonControl.defaultProps = {
  className: null,
  buttonClassName: null,
  tooltip: null,
  tooltipPlacement: 'bottom',
};

export default ButtonControl;
