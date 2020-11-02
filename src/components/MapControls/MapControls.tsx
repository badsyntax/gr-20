import React, { Fragment } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import classNames from 'classnames/bind';
import { default as OLMap } from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import { DownloadControlButton } from '../ControlButtons/DownloadControlButton/DownloadControlButton';
import { MyLocationControlButton } from '../ControlButtons/MyLocationControlButton/MyLocationControlButton';
import { PdfExportControlButton } from '../ControlButtons/PdfExportControlButton/PdfExportControlButton';
import { ZoomToExtentControlButton } from '../ControlButtons/ZoomToExtentControlButton/ZoomToExtentControlButton';
import { ZoomInControlButton } from '../ControlButtons/ZoomInControlButton/ZoomInControlButton';
import { ZoomOutControlButton } from '../ControlButtons/ZoomOutControlButton/ZoomOutControlButton';
import { SettingsToggleControlButton } from '../ControlButtons/SettingsToggleControlButton/SettingsToggleControlButton';
import { useStyles } from './styles';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const FADE_TIMEOUT = 800;

export interface MapControlsProps {
  map: OLMap;
  source: VectorSource;
}

export const MapControls: React.FunctionComponent<MapControlsProps> = ({
  map,
  source,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Fragment>
      <Fade in timeout={FADE_TIMEOUT}>
        <div className={classes.actionsContainer}>
          <ButtonGroup
            orientation="horizontal"
            variant="text"
            className={classes.buttonGroup}
          >
            <ZoomToExtentControlButton label="Fit Extent" map={map} />
            <PdfExportControlButton label="Export to PDF" map={map} />
            <DownloadControlButton
              label="Download Route and Maps"
              source={source}
              map={map}
            />
            <MyLocationControlButton label="Show My Location" map={map} />
          </ButtonGroup>
          <ButtonGroup
            orientation="horizontal"
            variant="text"
            className={classes.buttonGroup}
          >
            <SettingsToggleControlButton label="Settings" />
          </ButtonGroup>
        </div>
      </Fade>
      <Fade in timeout={FADE_TIMEOUT}>
        <div className={classes.zoomContainer}>
          <ButtonGroup
            orientation="vertical"
            variant="text"
            className={classNames(
              classes.buttonGroup,
              classes.buttonGroupVertical
            )}
          >
            <ZoomInControlButton label="Zoom In" map={map} />
            {!isMobile && (
              <div style={{ height: 100, textAlign: 'center' }}>
                <Slider
                  orientation="vertical"
                  defaultValue={30}
                  aria-labelledby="vertical-slider"
                />
              </div>
            )}
            <ZoomOutControlButton label="Zoom Out" map={map} />
          </ButtonGroup>
        </div>
      </Fade>
    </Fragment>
  );
};
