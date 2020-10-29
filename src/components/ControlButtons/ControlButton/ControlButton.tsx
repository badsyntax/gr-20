import classNames from 'classnames/bind';
import * as Popper from 'popper.js';
import React, { memo, useEffect, useRef, useState } from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';
import STYLES from './ControlButton.module.scss';

const c = classNames.bind(STYLES);

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ControlButtonProps = ButtonProps & {
  onClick: () => void;
  className?: string;
  buttonClassName?: string;
  tooltip?: string;
  tooltipPlacement?: Popper.Placement;
};

export const ControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  ({
    children,
    onClick,
    className,
    buttonClassName,
    tooltip,
    tooltipPlacement = 'bottom',
    ...rest
  }) => {
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      buttonRef?.current?.addEventListener('click', onClick);
      const current = buttonRef?.current;
      return () => {
        current?.removeEventListener('click', onClick);
      };
    });

    const toggleTooltip = () => {
      setTooltipOpen(!tooltipOpen);
    };

    return (
      <div className={c(STYLES.ControlButton__container, className)}>
        <button
          className={c(STYLES.ControlButton, buttonClassName)}
          type="button"
          ref={buttonRef}
          {...rest}
        >
          {children}
        </button>
        {tooltip && buttonRef.current && (
          <Tooltip
            placement={tooltipPlacement}
            isOpen={tooltipOpen}
            target={buttonRef.current}
            toggle={toggleTooltip}
            delay={{ show: 0, hide: 0 }}
            modifiers={{
              offset: {
                offset: '0,5',
              },
            }}
          >
            {tooltip}
          </Tooltip>
        )}
      </div>
    );
  }
);
