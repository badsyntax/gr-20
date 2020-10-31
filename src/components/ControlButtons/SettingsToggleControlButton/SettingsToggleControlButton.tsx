import React, { useRef, useState } from 'react';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { Settings } from '../../Settings/Settings';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useStyles } from './SettingsToggleControlButton.styles';
import { Grow } from '@material-ui/core';

export const SettingsToggleControlButton: React.FunctionComponent<Omit<
  ControlButtonProps,
  'onClick'
>> = ({ ...rest }) => {
  const classes = useStyles();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className={classes.root}>
        <ControlButton {...rest} ref={anchorRef} onClick={handleButtonClick}>
          <SettingsIcon />
        </ControlButton>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          className={classes.popover}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} in={isOpen} timeout={100}>
              <div>
                <Settings />
              </div>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
