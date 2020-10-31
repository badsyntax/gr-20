import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import React, { memo } from 'react';
import { getDataFromCoords } from '../../util/util';

export interface PointDataProps {
  feature: Feature<Point>;
}

export const PointData: React.FunctionComponent<PointDataProps> = memo(
  ({ feature }) => {
    const { lonLat, hdms, elevation } = getDataFromCoords(
      feature.getGeometry().getCoordinates()
    );
    const lon = (lonLat[0] || 0).toFixed(6);
    const lat = (lonLat[1] || 0).toFixed(6);
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Elevation:</TableCell>
            <TableCell>{elevation}m</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Longitude:</TableCell>
            <TableCell>{lon}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Latitude:</TableCell>
            <TableCell>{lat}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coordinates:</TableCell>
            <TableCell>{hdms}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);
