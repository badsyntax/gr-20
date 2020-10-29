import classNames from 'classnames/bind';
import React, { memo } from 'react';
import { Table } from 'reactstrap';
import STYLES from './PointData.module.scss';

const c = classNames.bind(STYLES);

export interface PointDataProps {
  elevation: number;
  lon: string;
  lat: string;
  hdms: string;
}

export const PointData: React.FunctionComponent<PointDataProps> = memo(
  ({ elevation, lon, lat, hdms }) => {
    return (
      <Table borderless className={c('table')}>
        <tbody>
          <tr>
            <th scope="row">Elevation:</th>
            <td>{elevation}m</td>
          </tr>
          <tr>
            <th scope="row">Longitude:</th>
            <td>{lon}</td>
          </tr>
          <tr>
            <th scope="row">Latitude:</th>
            <td>{lat}</td>
          </tr>
          <tr>
            <th scope="row">Coordinates:</th>
            <td>
              <span className={c('coordinates')}>{hdms}</span>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
);
