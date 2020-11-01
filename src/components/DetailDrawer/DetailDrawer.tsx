import React from 'react';
import { default as OLMap } from 'ol/Map';

import Drawer from '@material-ui/core/Drawer';
import { useTheme } from '@material-ui/core/styles';
import { useStyles } from './DetailDrawer.styles';
import { WaypointDetail } from '../WaypointDetail/WaypointDetail';
import { Stage } from '../../util/types';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { StageDetail } from '../StageDetail/StageDetail';

export interface DetailDrawerProps {
  isOpen: boolean;
  stage?: Stage;
  map: OLMap;
  feature?: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  onClose: () => void;
  selectFeature: (feature: Feature<Point>) => void;
  sortedPointFeatures: Feature<Point>[];
}

export const DetailDrawer: React.FunctionComponent<DetailDrawerProps> = ({
  map,
  isOpen,
  onClose,
  feature,
  nextFeature,
  prevFeature,
  stage,
  selectFeature,
  sortedPointFeatures,
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
        {feature && (
          <WaypointDetail
            map={map}
            selectFeature={selectFeature}
            onClose={onClose}
            feature={feature}
            sortedPointFeatures={sortedPointFeatures}
            prevFeature={prevFeature}
            nextFeature={nextFeature}
          />
        )}
        {stage && <StageDetail onClose={onClose} stage={stage} />}
      </Drawer>
    </nav>
  );
};
