import React from 'react';
import { default as MuiAppBar } from '@material-ui/core/AppBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

export interface AppBarProps {
  onSettingsToggle: () => void;
}

export const AppBar: React.FunctionComponent<AppBarProps> = ({
  onSettingsToggle,
}) => {
  const classes = useStyles();

  return (
    <MuiAppBar position="fixed" className={classes.root}>
      <Toolbar variant="dense">
        <Typography variant="h6" noWrap className={classes.title}>
          GR-20 Corsica
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Settings"
          edge="end"
          onClick={onSettingsToggle}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};
