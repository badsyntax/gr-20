import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = 380;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
      boxShadow: theme.shadows[24],
    },
  })
);
