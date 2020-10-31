import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../features/settings';
import { RootState } from '../../store';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { routes } from '../../data/routes/routes';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import { useStyles } from './Settings.styles';
import { Paper } from '@material-ui/core';
import maps from '../../data/maps/maps.json';

export const Settings: React.FunctionComponent = () => {
  const classes = useStyles();
  const settings = useSelector((state: RootState) => state.settings);
  const { isVisible: isLoading } = useSelector(
    (state: RootState) => state.spinner
  );
  const dispatch = useDispatch();

  const onFieldChange = (
    event: React.ChangeEvent<{
      value: unknown;
      name?: string;
      type?: string;
      checked?: boolean;
    }>
  ) => {
    const { name, type, checked, value } = event.target;
    if (name) {
      dispatch(
        updateSettings({
          [name]: type === 'checkbox' ? checked : value,
        })
      );
    }
  };

  return (
    <Paper className={classes.root}>
      <FormControl variant="outlined" margin="normal" fullWidth>
        <InputLabel>Route</InputLabel>
        <Select
          value={settings.gpxUrl}
          label="Route"
          name="gpxUrl"
          onChange={onFieldChange}
          disabled={isLoading}
          MenuProps={{
            classes: { paper: classes.selectPaper }, // hack to fix ClickAwayListener
            disablePortal: true, // hack to fix ClickAwayListener
          }}
        >
          {routes.map((route) => (
            <MenuItem value={route.url}>{route.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" margin="normal" fullWidth>
        <InputLabel>Layer</InputLabel>
        <Select
          value={settings.mapUrl}
          label="Layer"
          name="mapUrl"
          onChange={onFieldChange}
          disabled={isLoading}
          MenuProps={{
            classes: { paper: classes.selectPaper }, // hack to fix ClickAwayListener
            disablePortal: true, // hack to fix ClickAwayListener
          }}
        >
          {maps.map((route) => (
            <MenuItem value={route.url}>{route.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FormControlLabel
        className={classes.formControl}
        control={
          <Checkbox
            onChange={onFieldChange}
            name="showControls"
            color="primary"
            checked={settings.showControls}
          />
        }
        label="Show controls"
      /> */}
      <FormControl margin="dense" fullWidth>
        <FormGroup>
          <FormControlLabel
            disabled={isLoading}
            control={
              <Checkbox
                onChange={onFieldChange}
                name="showMarkers"
                color="primary"
                checked={settings.showMarkers}
              />
            }
            key="show-markers"
            label="Show Markers"
          />
          <FormControlLabel
            disabled={isLoading}
            control={
              <Checkbox
                onChange={onFieldChange}
                name="showRoute"
                color="primary"
                checked={settings.showRoute}
              />
            }
            key="show-route"
            label="Show Route"
          />
          <FormControlLabel
            disabled={isLoading}
            control={
              <Checkbox
                onChange={onFieldChange}
                name="showFeatureLabels"
                color="primary"
                checked={settings.showFeatureLabels}
              />
            }
            key="show-point-labels"
            label="Show Point Labels"
          />
        </FormGroup>
      </FormControl>
    </Paper>
  );
};
