import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import classNames from 'classnames/bind';
import React, { memo } from 'react';
import { getMultiCoordsFromNextFeature } from '../../../util/util';
import STYLES from '../PointData/PointData.module.scss';
import Table from 'reactstrap/lib/Table';

const c = classNames.bind(STYLES);

export interface NextPointDataProps {
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  nextFeature: Feature<Point>;
}

export const NextPointData: React.FunctionComponent<NextPointDataProps> = memo(
  ({ feature, nextFeature, gpxVectorLayer }) => {
    const multiCoords = getMultiCoordsFromNextFeature(
      feature,
      nextFeature,
      gpxVectorLayer
    );
    return (
      <Table borderless className={c('table')}>
        <tbody>
          <tr>
            <th scope="row">Distance:</th>
            <td>{multiCoords.distanceInKm}km</td>
          </tr>
          <tr>
            <th scope="row">Elevation gain:</th>
            <td>{multiCoords.elevationGainUp}m</td>
          </tr>
          <tr>
            <th scope="row">Elevation loss:</th>
            <td>{multiCoords.elevationGainDown}m</td>
          </tr>
        </tbody>
      </Table>
    );
  }
);
