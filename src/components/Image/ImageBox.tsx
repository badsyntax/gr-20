import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import React, { memo } from 'react';
import { useImage } from '../../hooks/useImage';
import { useStyles } from './ImageBoxStyles';

export interface ImageBoxProps {
  url: string;
  height: number;
  fade?: boolean;
  timeout?: number;
}

export const ImageBox: React.FunctionComponent<ImageBoxProps> = memo(
  ({ url, height, fade = false, timeout = 800 }) => {
    const { isLoaded } = useImage(url);
    const classes = useStyles();

    const image = (
      <Box
        className={classes.root}
        style={{
          backgroundImage: `url("${url}")`,
          minHeight: height,
        }}
      />
    );

    return fade ? (
      <Fade in={isLoaded} timeout={timeout}>
        {image}
      </Fade>
    ) : (
      image
    );
  }
);
