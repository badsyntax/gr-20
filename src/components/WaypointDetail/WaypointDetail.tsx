import React, { Fragment, memo } from 'react';
import { default as OLMap } from 'ol/Map';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { ImageBox } from '../ImageBox/ImageBox';
import { PointData } from '../PointData/PointData';
import { WaypointControlButtons } from '../WaypointControlButtons/WaypointControlButtons';
import { useStyles } from './WaypointDetail.styles';

export interface WaypointDetailProps {
  map: OLMap;
  feature: Feature<Point>;
  nextFeature?: Feature<Point>;
  prevFeature?: Feature<Point>;
  onClose: () => void;
  selectFeature: (feature: Feature<Point>) => void;
  sortedPointFeatures: Feature<Point>[];
}

export const WaypointDetail: React.FunctionComponent<WaypointDetailProps> = memo(
  ({
    map,
    feature,
    nextFeature,
    prevFeature,
    onClose,
    selectFeature,
    sortedPointFeatures,
  }) => {
    const classes = useStyles();
    const { name, image } = feature.getProperties();
    const currentFeatureIndex = sortedPointFeatures.indexOf(feature);
    const onSelectNextStage = () => {
      alert('select next stage');
    };

    return (
      <Fragment>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">{name}</Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <ImageBox height={220} url={image} label="Examplelabel" />
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
        {nextFeature && (
          <Box p={2} className={classes.nextStageButtonContainer}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={onSelectNextStage}
            >
              Next Stage ({currentFeatureIndex + 1} of{' '}
              {sortedPointFeatures.length})
            </Button>
          </Box>
        )}
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
