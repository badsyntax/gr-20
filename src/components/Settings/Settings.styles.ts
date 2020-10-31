import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      padding: theme.spacing(3),
      textAlign: theme.direction === 'rtl' ? 'right' : 'left',
      width: 320,
    },
    formControl: {
      display: 'block',
      marginBottom: theme.spacing(2),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    selectPaper: {
      // hack to fix Material UI popover position when disablePortal is true
      left: `${theme.spacing(2)}px !important`,
      maxHeight: 'none !important',
      top: `${theme.spacing(2)}px !important`,
    },
  })
);
