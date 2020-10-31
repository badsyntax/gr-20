import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-flex',
    },
    popover: {
      marginTop: theme.spacing(2),
    },
    typography: {
      padding: theme.spacing(2),
    },
  })
);
