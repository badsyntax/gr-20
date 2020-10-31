import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Map } from '../Map/Map';
import { useStyles } from './styles';

export const MapPage: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>GR-20 - The Route</title>
      </Helmet>
      <main className={classes.content}>
        <Map />
      </main>
    </Fragment>
  );
};
