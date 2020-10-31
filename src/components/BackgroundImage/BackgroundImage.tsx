import Box from '@material-ui/core/Box';
import React, { memo } from 'react';
import { useStyles } from './BackgroundImage.styles';

export interface BackgroundImageProps {
  imageUrl: string;
  opacity?: number;
  className?: string;
}

export const BackgroundImage: React.FunctionComponent<BackgroundImageProps> = memo(
  ({ imageUrl, children, className, opacity = 0.25, ...rest }) => {
    const classes = useStyles();
    return (
      <Box
        className={classes.root}
        display="flex"
        justifyContent="center"
        style={{
          backgroundImage: `linear-gradient(
        rgba(0, 0, 0, ${opacity}),
        rgba(0, 0, 0, ${opacity})
      ), url("${imageUrl}")`,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
