import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionsContainer: {
      position: 'fixed',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 1,
    },
    zoomContainer: {
      position: 'fixed',
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      zIndex: 1,
    },
    buttonGroup: {
      background: theme.palette.common.white,
      margin: theme.spacing(1),
    },
    buttonGroupVertical: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
  })
);
