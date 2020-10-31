import React from 'react';
import { default as MuiPopover } from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { default as OLMap } from 'ol/Map';
import { getDataFromCoords } from '../../util/util';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1, 2),
    },
  })
);

interface PopoverProps {
  map: OLMap;
  isOpen: boolean;
  feature: Feature<Point>;
  setIsOpen: (isOpen: boolean) => void;
}

export const Popover: React.FunctionComponent<PopoverProps> = ({
  map,
  isOpen,
  feature,
  setIsOpen,
}) => {
  const classes = useStyles();
  const coordinates = feature.getGeometry().getCoordinates();
  const pixelPosition = map.getPixelFromCoordinate(coordinates);
  const { name } = feature.getProperties();
  const { elevation } = getDataFromCoords(
    feature.getGeometry().getCoordinates()
  );
  return (
    <MuiPopover
      open={isOpen}
      anchorReference="anchorPosition"
      anchorPosition={{ left: pixelPosition[0], top: pixelPosition[1] }}
      onClose={() => setIsOpen(false)}
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      disableRestoreFocus
      disableScrollLock
      disableAutoFocus
      disableEnforceFocus
      hideBackdrop
    >
      <Typography>
        {name} ({elevation}m)
      </Typography>
    </MuiPopover>
  );
};
