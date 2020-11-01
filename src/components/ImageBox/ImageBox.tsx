import React, {
  forwardRef,
  Fragment,
  memo,
  MouseEventHandler,
  useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import CloseIcon from '@material-ui/icons/Close';

import { useImage } from '../../hooks/useImage';
import { useStyles } from './ImageBoxStyles';
import Typography from '@material-ui/core/Typography';

export interface ImageBoxProps {
  url: string;
  label: string;
  height?: number | string;
  timeout?: number;
}

export interface ImageProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Image: React.FunctionComponent<ImageProps & ImageBoxProps> = memo(
  ({ url, label, onClick, timeout, height = '100%' }) => {
    const { isLoaded } = useImage(url);
    const classes = useStyles();

    return (
      <Fade in={isLoaded} timeout={timeout}>
        <Box
          className={classes.root}
          style={{
            ...(isLoaded && {
              backgroundImage: `url("${url}")`,
            }),
            minHeight: height,
            position: 'relative',
            zIndex: 999,
          }}
          arial-label={label}
          onClick={onClick}
        ></Box>
      </Fade>
    );
  }
);

const Transition: React.FunctionComponent<
  TransitionProps & { children?: React.ReactElement }
> = forwardRef((props, ref) => {
  return <Fade timeout={600} in ref={ref} {...props} />;
});

export const ImageBox: React.FunctionComponent<ImageBoxProps> = memo(
  ({ url, label, height, timeout = 800 }) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleImageClick = (
      evt: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      evt.preventDefault();
      setIsOpen(true);
    };

    return (
      <Fragment>
        <Image
          label={label}
          url={url}
          height={height}
          onClick={handleImageClick}
          timeout={timeout}
        />
        <Dialog
          onClose={handleClose}
          aria-labelledby="image-box-dialog-title"
          open={isOpen}
          fullScreen
          TransitionComponent={Transition}
        >
          <DialogTitle
            disableTypography
            id="image-box-dialog-title"
            className={classes.title}
          >
            <Typography variant="h6">{label}</Typography>
            <IconButton
              edge="end"
              onClick={handleClose}
              className={classes.titleCloseButton}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Image label={label} url={url} />
        </Dialog>
      </Fragment>
    );
  }
);
