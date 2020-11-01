import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import React, { memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { getMultiCoordsFromNextFeature } from '../../util/util';

export interface NextPointDataProps {
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  nextFeature: Feature<Point>;
  name: string;
}

export const NextPointData: React.FunctionComponent<NextPointDataProps> = memo(
  ({ feature, nextFeature, gpxVectorLayer, name }) => {
    const multiCoords = getMultiCoordsFromNextFeature(
      feature,
      nextFeature,
      gpxVectorLayer
    );
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Name:</TableCell>
            <TableCell>{name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Distance:</TableCell>
            <TableCell>{multiCoords.distanceInKm}km</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Elevation gain:</TableCell>
            <TableCell>{multiCoords.elevationGainUp}m</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Elevation loss:</TableCell>
            <TableCell>{multiCoords.elevationGainDown}m</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);
