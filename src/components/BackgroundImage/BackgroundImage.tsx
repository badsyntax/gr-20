import { getTheme, IStackProps, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

const theme = getTheme();

const className = mergeStyles({
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'top',
  color: theme.palette.white,
  boxShadow: 'inset 0 0 8rem rgba(0,0,0,.5);',
});

export interface BackgroundImageProps {
  imageUrl: string;
  opacity?: number;
}

export const BackgroundImage: React.FunctionComponent<
  BackgroundImageProps & IStackProps
> = ({ imageUrl, children, opacity = 0.25, ...rest }) => {
  return (
    <Stack
      className={className}
      style={{
        backgroundImage: `linear-gradient(
        rgba(0, 0, 0, ${opacity}),
        rgba(0, 0, 0, ${opacity})
      ), url("${imageUrl}")`,
      }}
      {...rest}
    >
      {children}
    </Stack>
  );
};
