import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Map } from '../Map/Map';
import { Settings } from '../Settings/Settings';
import { Spinner } from '../Spinner/Spinner';
import STYLES from './MapPage.module.scss';

export const MapPage: React.FunctionComponent = () => (
  <Fragment>
    <Helmet>
      <title>GR-20 - The Route</title>
    </Helmet>
    <div className={STYLES.MapPage}>
      <Spinner />
      <Settings />
      <Map />
    </div>
  </Fragment>
);
