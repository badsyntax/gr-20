import IconButton from '@material-ui/core/IconButton';
import React, { Fragment, memo } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Stage } from '../../util/types';
import { useStyles } from './StageDetail.styles';

export interface StageDetailProps {
  stage: Stage;
  onClose: () => void;
}

export const StageDetail: React.FunctionComponent<StageDetailProps> = memo(
  ({ stage, onClose }) => {
    const classes = useStyles();
    return (
      <Fragment>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Stage 1</Typography>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </Fragment>
    );
  }
);
