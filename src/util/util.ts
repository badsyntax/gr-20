import { Coordinate, toStringHDMS } from 'ol/coordinate';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { default as OLMap } from 'ol/Map';
import { toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';

const { MULTI_LINE_STRING, POINT } = GeometryType;

export const getHDMS = (coordinate: Coordinate): string => {
  const lonLat = toLonLat(coordinate);
  const hdms = toStringHDMS(lonLat);
  return hdms;
};

export const getElevation = (coordinate: Coordinate): number => {
  const elevation = Math.round(coordinate[2]);
  return elevation;
};

export interface DataMultiCoords {
  distance: number;
  elevationGainUp: number;
  elevationGainDown: number;
  distanceInKm: string;
}

export const getDataFromMultiCoords = (
  multiCoords: Coordinate[]
): DataMultiCoords => {
  const data = multiCoords.reduce<DataMultiCoords>(
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
      distanceInKm: '',
    }
  );
  data.distanceInKm = (data.distance / 1000).toFixed(2);
  return data;
};

interface DataCoords {
  lonLat: Coordinate;
  hdms: string;
  elevation: number;
}

export const getDataFromCoords = (coords: Coordinate): DataCoords => {
  const lonLat = toLonLat(coords);
  const hdms = getHDMS(coords);
  const elevation = getElevation(coords);
  return { lonLat, hdms, elevation };
};

export const getNextFeature = (
  feature: Feature<Point>,
  // gpxVectorLayer: VectorLayer,
  sortedPointFeatures: Feature<Point>[]
): Feature<Point> => {
  const sortedPointIndex = sortedPointFeatures.indexOf(feature);
  const nextPoint = sortedPointFeatures[sortedPointIndex + 1];
  return nextPoint;
};

export const getPrevFeature = (
  feature: Feature<Point>,
  sortedPointFeatures: Feature<Point>[]
): Feature<Point> => {
  const sortedPointIndex = sortedPointFeatures.indexOf(feature);
  const nextPoint = sortedPointFeatures[sortedPointIndex - 1];
  return nextPoint;
};

export const getMultiCoordsFromNextFeature = (
  feature: Feature<Point>,
  nextFeature: Feature<Point>,
  gpxVectorLayer: VectorLayer
): DataMultiCoords => {
  const multiLine = getMultiLineStringFeature(
    gpxVectorLayer.getSource().getFeatures()
  );
  if (!multiLine) {
    throw new Error('unable to find multiLine feature in gpx vector layer');
  }
  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];
  const featureIndex = getFeatureIndexInMultiLine(feature, multiLine);
  const nextFeatureIndex = getFeatureIndexInMultiLine(nextFeature, multiLine);
  const multiCoords = multiLineCoords.slice(featureIndex, nextFeatureIndex);
  return getDataFromMultiCoords(multiCoords);
};

export const getLayerById = <T>(map: OLMap, id: string): T | undefined =>
  (map
    .getLayers()
    .getArray()
    .find((layer) => layer.get('id') === id) as unknown) as T;

export const getMultiLineStringFeature = (
  features: Feature<Geometry>[]
): Feature<MultiLineString> | undefined => {
  return features.find(
    (feature) => feature.getGeometry().getType() === MULTI_LINE_STRING
  ) as Feature<MultiLineString>;
};

export const getPointFeatures = (
  features: Feature<Geometry>[]
): Feature<Point>[] =>
  features.filter(
    (feature) => feature.getGeometry().getType() === POINT
  ) as Feature<Point>[];

export interface SortedPointFeature {
  featurePoint: Feature<Point>;
  closestPointInMultiLine: Coordinate;
  index: number;
}

export const getFeatureIndexInMultiLine = (
  feature: Feature<Point>,
  multiLine: Feature<MultiLineString>
): number => {
  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];
  const closestPointInMultiLine = multiLine
    .getGeometry()
    .getClosestPoint(feature.getGeometry().getCoordinates());
  const margin = 50; // meters
  const closesPointIndex = multiLineCoords.findIndex(
    (coord) =>
      new LineString([coord, closestPointInMultiLine]).getLength() < margin
  );
  return closesPointIndex;
};

export const getSortedPointFeatures = (
  vectorSource: VectorSource
): Feature<Point>[] => {
  const points = getPointFeatures(vectorSource.getFeatures());
  const multiLine = getMultiLineStringFeature(vectorSource.getFeatures());
  if (!multiLine) {
    throw new Error(
      'getSortedPointFeatures: unable to find multiLine feature in gpx vector layer'
    );
  }
  const pointsInMultiLine = points.map((point) => {
    const featureIndex = getFeatureIndexInMultiLine(point, multiLine);
    return {
      featurePoint: point,
      index: featureIndex,
    };
  });

  const sortedPointsInMultiline = pointsInMultiLine.sort(
    (a, b) => a.index - b.index
  );
  return sortedPointsInMultiline.map(({ featurePoint }) => featurePoint);
};

export const sampleCoordinates = (
  coords: Coordinate[],
  minDistanceThreshold = 0
): {
  coord: Coordinate;
  distance: number;
  distanceFromStart: number;
}[] => {
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
