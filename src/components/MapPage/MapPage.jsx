import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import DropdownGroup from '../DropdownGroup/DropdownGroup'
import Map from '../Map/Map'
import maps from '../../data/maps/maps'
import routes from '../../data/routes/routes'
import SpinnerProvider from '../Spinner/SpinnerProvider'
import STYLES from './MapPage.module.scss'

class MapPage extends Component {
  state = {
    values: {
      map: maps[0].url,
      showElevationProfile: false,
      showControls: true,
      showMarkers: true,
      showRoute: true,
      route: routes[0].url,
    },
    dropdowns: [
      {
        label: 'Routes',
        name: 'route',
        items: routes,
      },
      {
        label: 'Maps',
        name: 'map',
        items: maps,
      },
      {
        label: 'Options',
        name: 'options',
        type: 'formGroup',
        items: [
          {
            name: 'showElevationProfile',
            label: 'Show elevation profile',
          },
          {
            name: 'showControls',
            label: 'Show controls',
          },
          {
            name: 'showMarkers',
            label: 'Show markers',
          },
          {
            name: 'showRoute',
            label: 'Show route',
          },
        ],
      },
    ],
  }

  onDropdownChange = values => {
    this.setState({
      values,
    })
  }

  render() {
    const { values, dropdowns } = this.state
    const {
      map,
      route,
      showElevationProfile,
      showControls,
      showMarkers,
      showRoute,
    } = values
    return (
      <SpinnerProvider>
        <Helmet>
          <title>GR-20 - The Route</title>
        </Helmet>
        <div className={STYLES.MapPage}>
          <DropdownGroup
            values={values}
            dropdowns={dropdowns}
            onChange={this.onDropdownChange}
          />
          <Map
            mapUrl={map}
            gpxUrl={route}
            showElevationProfile={showElevationProfile}
            showControls={showControls}
            showMarkers={showMarkers}
            showRoute={showRoute}
          />
        </div>
      </SpinnerProvider>
    )
  }
}

export default MapPage
