import LineString from 'ol/geom/LineString';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import GeometryType from 'ol/geom/GeometryType';

const { MULTI_LINE_STRING, POINT } = GeometryType;

export const getHDMS = coords => {
  const lonLat = toLonLat(coords);
  const hdms = toStringHDMS(lonLat);
  return hdms;
};

export const getElevation = coords => {
  const elevation = Math.round(coords[2]);
  return elevation;
};

export const getDataFromMultiCoords = multiCoords => {
  const data = multiCoords.reduce(
    (accumulator, currentValue, i) => {
      if (i === multiCoords.length - 1) {
        return accumulator;
      }
      const nextValue = multiCoords[i + 1];

      accumulator.distance += new LineString([
        currentValue,
        nextValue,
      ]).getLength();

      const currentElevation = getElevation(currentValue);
      const nextElevation = getElevation(nextValue);
      const elevation = nextElevation - currentElevation;

      if (elevation < 0) {
        accumulator.elevationGainDown += Math.abs(elevation);
      } else {
        accumulator.elevationGainUp += elevation;
      }

      return accumulator;
    },
    {
      distance: 0,
      elevationGainUp: 0,
      elevationGainDown: 0,
    }
  );
  return data;
};

export const getDataFromCoords = coords => {
  const lonLat = toLonLat(coords);
  const hdms = getHDMS(coords);
  const elevation = getElevation(coords);
  return { lonLat, hdms, elevation };
};

export const getDataFromPointFeature = (
  feature,
  gpxVectorLayer,
  sortedPointFeatures
) => {
  const multiLine = getMultiLineStringFeature(
    gpxVectorLayer.getSource().getFeatures()
  );

  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];

  const sortedPoint = sortedPointFeatures.find(
    ({ featurePoint }) => featurePoint === feature
  );

  const sortedPointIndex = sortedPointFeatures.indexOf(sortedPoint);
  const nextPoint = sortedPointFeatures[sortedPointIndex + 1];

  if (nextPoint) {
    const coords = multiLineCoords.slice(sortedPoint.index, nextPoint.index);
    return {
      sortedPoint,
      ...getDataFromMultiCoords(coords),
    };
  }
  return {
    sortedPoint,
  };
};

export const getLayerById = (map, id) =>
  map
    .getLayers()
    .getArray()
    .find(layer => layer.get('id') === id);

export const getMultiLineStringFeature = features =>
  features.find(
    feature => feature.getGeometry().getType() === MULTI_LINE_STRING
  );

export const getPointFeatures = features =>
  features.filter(feature => feature.getGeometry().getType() === POINT);

export const getSortedPointFeatures = vectorLayer => {
  const points = getPointFeatures(vectorLayer.getSource().getFeatures());
  const multiLine = getMultiLineStringFeature(
    vectorLayer.getSource().getFeatures()
  );
  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];
  const pointsInMultiLine = points.map(point => {
    const closestPointInMultiLine = multiLine
      .getGeometry()
      .getClosestPoint(point.getGeometry().getCoordinates());
    const margin = 50; // meters
    const closesPointIndex = multiLineCoords.findIndex(
      coord =>
        new LineString([coord, closestPointInMultiLine]).getLength() < margin
    );
    return {
      featurePoint: point,
      closestPointInMultiLine,
      index: closesPointIndex,
    };
  });
  const sortedPointsInMultiline = pointsInMultiLine.sort(
    (a, b) => a.index - b.index
  );
  return sortedPointsInMultiline;
};

export const sampleCoordinates = (coords, minDistanceThreshold = 0) => {
  let curMinDistance = 0;
  let distanceFromStart = 0;
  return coords
    .map((coord, i) => {
      const distance =
        i === 0 ? 0 : new LineString([coords[i - 1], coord]).getLength(); // meter
      distanceFromStart += distance;
      return {
        coord,
        distance,
        distanceFromStart,
      };
    })
    .filter((point, i) => {
      curMinDistance += point.distance;
      if (!i || curMinDistance > minDistanceThreshold) {
        curMinDistance = 0;
        return true;
      }
      return false;
    });
};
