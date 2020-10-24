import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import DropdownGroup from '../DropdownGroup/DropdownGroup';
import Map from '../Map/Map';
import maps from '../../data/maps/maps';
import routes from '../../data/routes/routes';
import SpinnerProvider from '../Spinner/SpinnerProvider';
import Spinner from '../Spinner/Spinner';
import OptionsProvider from '../Options/OptionsProvider';

import MapControls from '../MapControls/MapControls';
// import ElevationProfile from '../ElevationProfile/ElevationProfile';
import Popup from '../Popup/Popup';
import GpxLayer from '../GpxLayer/GpxLayer';
import TileLayer from '../TileLayer/TileLayer';
import StartEndLayer from '../StartEndLayer/StartEndLayer';

import STYLES from './MapPage.module.scss';

const initialOptions = {
  mapUrl: maps[0].url,
  gpxUrl: routes[0].url,
};

const MapPage = (props) => (
  <Fragment>
    <Helmet>
      <title>GR-20 - The Route</title>
    </Helmet>
    <div className={STYLES.MapPage}>
      <SpinnerProvider>
        <OptionsProvider values={initialOptions}>
          <Spinner />
          <DropdownGroup />
          <Map>
            <TileLayer />
            <GpxLayer />
            <Popup />
            <StartEndLayer />
            <MapControls />
            {/* <ElevationProfile /> */}
          </Map>
        </OptionsProvider>
      </SpinnerProvider>
    </div>
  </Fragment>
);

export default MapPage;
