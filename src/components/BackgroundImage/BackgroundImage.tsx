import classNames from 'classnames';
import React from 'react';
import STYLES from './BackgroundImage.module.scss';

export interface BackgroundImageProps {
  imageUrl: string;
  opacity?: number;
  className?: string;
}

export const BackgroundImage: React.FunctionComponent<BackgroundImageProps> = ({
  imageUrl,
  children,
  className,
  opacity = 0.25,
  ...rest
}) => {
  return (
    <div
      className={classNames(STYLES.BackgroundImage, className)}
      style={{
        backgroundImage: `linear-gradient(
        rgba(0, 0, 0, ${opacity}),
        rgba(0, 0, 0, ${opacity})
      ), url("${imageUrl}")`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
