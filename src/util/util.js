import LineString from 'ol/geom/LineString';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import GeometryType from 'ol/geom/GeometryType';

const { MULTI_LINE_STRING, POINT } = GeometryType;

export const getElevation = (feature, coordinate) => {
  const geometry = feature.getGeometry();
  const point = geometry.getClosestPoint(coordinate);
  const elevation = Math.round(point[2]);
  return elevation;
};

export const getHDMS = coordinate => {
  const lonLat = toLonLat(coordinate);
  const hdms = toStringHDMS(lonLat);
  return hdms;
};

export const getMultiLineStringFeature = features =>
  features.find(
    feature => feature.getGeometry().getType() === MULTI_LINE_STRING
  );

export const getPointFeatures = features =>
  features.filter(feature => feature.getGeometry().getType() === POINT);

export const getSortedPoints = vectorLayer => {
  const points = getPointFeatures(vectorLayer.getSource().getFeatures());
  const multiLine = getMultiLineStringFeature(
    vectorLayer.getSource().getFeatures()
  );
  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];
  const pointsInMultiLine = points.map(point => {
    const closestPointInMultiLine = multiLine
      .getGeometry()
      .getClosestPoint(point.getGeometry().getCoordinates());
    const closesPointIndex = multiLineCoords.findIndex(
      coord => new LineString([coord, closestPointInMultiLine]).getLength() < 30
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
