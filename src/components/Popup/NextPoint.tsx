import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import React, { Fragment, memo } from 'react';
import { getMultiCoordsFromNextFeature } from '../../util/util';

export interface NextPointProps {
  gpxVectorLayer: VectorLayer;
  feature: Feature<Point>;
  nextFeature: Feature<Point>;
}

export const NextPoint: React.FunctionComponent<NextPointProps> = memo(
  ({ feature, nextFeature, gpxVectorLayer }) => {
    const multiCoords = getMultiCoordsFromNextFeature(
      feature,
      nextFeature,
      gpxVectorLayer
    );
    return (
      <Fragment>
        <strong>Next Point</strong>
        <div>Distance: {multiCoords.distanceInKm}km</div>
        <div>Elevation gain: {multiCoords.elevationGainUp}m</div>
        <div>Elevation loss: {multiCoords.elevationGainDown}m</div>
      </Fragment>
    );
  }
);
