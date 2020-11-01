import { default as OLMap } from 'ol/Map';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import React, { Fragment, memo } from 'react';
import { PointData } from '../PointData/PointData';
import { WaypointControlButtons } from '../WaypointControlButtons/WaypointControlButtons';
import { useStyles } from './WaypointDetail.styles';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { ImageBox } from '../ImageBox/ImageBox';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Button from '@material-ui/core/Button';

export interface WaypointDetailProps {
  map: OLMap;
  feature: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  onClose: () => void;
  selectFeature: (feature: Feature<Point>) => void;
  gpxVectorLayer: VectorLayer;
}

export const WaypointDetail: React.FunctionComponent<WaypointDetailProps> = memo(
  ({
    map,
    feature,
    nextFeature,
    prevFeature,
    gpxVectorLayer,
    onClose,
    selectFeature,
  }) => {
    const classes = useStyles();
    const { name, image } = feature.getProperties();
    return (
      <Fragment>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">{name}</Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <ImageBox height={220} url={image} fade label="Examplelabel" />
        <Divider />
        <WaypointControlButtons
          feature={feature}
          nextFeature={nextFeature}
          prevFeature={prevFeature}
          map={map}
          selectFeature={selectFeature}
        />
        <Divider />
        <Box>
          <PointData feature={feature} />
        </Box>
        {/* <List>
          <ListItem button>
            <PlayCircleOutlineIcon />
            <ListItemText primary="Next Stage (2 of 16)" />
          </ListItem>
        </List> */}
        <Box p={2} className={classes.nextStageButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            startIcon={<PlayCircleOutlineIcon />}
          >
            Next Stage (2 of 16)
          </Button>
        </Box>
        {/* <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Stage 1</Typography>
        </Toolbar>
        <Divider />
        <WaypointDetailTabs
          feature={feature}
          nextFeature={nextFeature}
          prevFeature={prevFeature}
          gpxVectorLayer={gpxVectorLayer}
        /> */}
      </Fragment>
    );
  }
);
