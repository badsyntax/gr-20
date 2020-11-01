import React, { forwardRef, memo } from 'react';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { PopperPlacementType } from '@material-ui/core/Popper';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTooltipStyles } from './ControlButtonStyles';

export type ControlButtonProps = ButtonProps & {
  label?: string;
  tooltipPlacement?: PopperPlacementType;
};

const CustomTooltip: React.FunctionComponent<TooltipProps> = memo((props) => {
  const classes = useTooltipStyles();
  return <Tooltip arrow classes={classes} {...props} />;
});

export const ControlButton: React.FunctionComponent<ControlButtonProps> = memo(
  forwardRef(
    ({ children, label, tooltipPlacement = 'bottom', ...rest }, ref) => {
      const button = (
        <Button {...rest} aria-label={label} ref={ref}>
          {children}
        </Button>
      );

      return label ? (
        <CustomTooltip title={label} placement={tooltipPlacement} arrow>
          {button}
        </CustomTooltip>
      ) : (
        button
      );
    }
  )
);
