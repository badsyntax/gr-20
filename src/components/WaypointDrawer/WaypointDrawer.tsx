import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { useTheme } from '@material-ui/core/styles';
import { useStyles } from './WaypointDrawer.styles';
import {
  WaypointDetail,
  WaypointDetailProps,
} from '../WaypointDetail/WaypointDetail';

export type WaypointDrawerProps = WaypointDetailProps & {
  isOpen: boolean;
};

export const WaypointDrawer: React.FunctionComponent<WaypointDrawerProps> = ({
  isOpen,
  onClose,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <nav className={classes.drawer} aria-label="waypoint">
      <Drawer
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        variant="persistent"
        open={isOpen}
        onClose={onClose}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        elevation={16}
      >
        <WaypointDetail onClose={onClose} {...rest} />
      </Drawer>
    </nav>
  );
};
