import React from 'react';
import { default as OLMap } from 'ol/Map';
import Drawer from '@material-ui/core/Drawer';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { PointData } from '../PointData/PointData';
import { WaypointControlButtons } from '../WaypointControlButtons/WaypointControlButtons';
import { WaypointDrawerTabs } from './WaypointDrawerTabs';

import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './WaypointDrawer.styles';
import IconButton from '@material-ui/core/IconButton';

export interface WaypointDrawerProps {
  isOpen: boolean;
  feature: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  map: OLMap;
  onClose: () => void;
  selectFeature: (feature: Feature<Point>) => void;
  gpxVectorLayer: VectorLayer;
}

export const WaypointDrawer: React.FunctionComponent<WaypointDrawerProps> = ({
  isOpen,
  feature,
  nextFeature,
  prevFeature,
  map,
  onClose,
  selectFeature,
  gpxVectorLayer,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { name } = feature.getProperties();

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="waypoint">
      <Drawer
        container={container}
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
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">{name}</Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <WaypointControlButtons
          feature={feature}
          nextFeature={nextFeature}
          prevFeature={prevFeature}
          map={map}
          selectFeature={selectFeature}
        />
        <Divider />

        <Box mb={2}>
          <PointData feature={feature} />
        </Box>
        <WaypointDrawerTabs
          feature={feature}
          nextFeature={nextFeature}
          prevFeature={prevFeature}
          gpxVectorLayer={gpxVectorLayer}
        />
      </Drawer>
    </nav>
  );
};
