import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const textStyles = {
  textShadow: '2px 2px 1px #000',
  cursor: 'auto',
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    summary: {
      ...textStyles,
      [theme.breakpoints.up('md')]: {
        ...theme.typography.h6,
      },
      color: theme.palette.common.white,
    },
    heading: {
      ...textStyles,
      ...theme.typography.h2,
      [theme.breakpoints.up('md')]: {
        ...theme.typography.h1,
      },
      color: theme.palette.common.white,
    },
    main: {
      maxWidth: '44em',
      height: '100%',
    },
  })
);
