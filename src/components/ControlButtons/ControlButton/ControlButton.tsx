import React, { forwardRef, memo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { PopperPlacementType } from '@material-ui/core/Popper';
import Button, { ButtonProps } from '@material-ui/core/Button';

export type ControlButtonProps = ButtonProps & {
  label?: string;
  tooltipPlacement?: PopperPlacementType;
};

export const ControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  forwardRef(
    ({ children, label, tooltipPlacement = 'bottom', ...rest }, ref) => {
      const button = (
        <Button {...rest} aria-label={label} ref={ref}>
          {children}
        </Button>
      );

      return label ? (
        <Tooltip title={label} placement={tooltipPlacement} arrow>
          {button}
        </Tooltip>
      ) : (
        button
      );
    }
  )
);
