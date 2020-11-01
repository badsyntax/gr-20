import { makeStyles, Theme } from '@material-ui/core/styles';

export const useTooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    // color: theme.palette.common.black,
  },
  tooltip: {
    // backgroundColor: theme.palette.common.black,
    ...theme.typography.body2,
  },
}));
