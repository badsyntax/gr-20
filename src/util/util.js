import LineString from 'ol/geom/LineString';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import GeometryType from 'ol/geom/GeometryType';

const { MULTI_LINE_STRING, POINT } = GeometryType;

export const getHDMS = (coords) => {
  const lonLat = toLonLat(coords);
  const hdms = toStringHDMS(lonLat);
  return hdms;
};

export const getElevation = (coords) => {
  const elevation = Math.round(coords[2]);
  return elevation;
};

export const getDataFromMultiCoords = (multiCoords) => {
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
  data.distanceInKm = (data.distance / 1000).toFixed(2);
  return data;
};

export const getDataFromCoords = (coords) => {
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

  if (!sortedPoint) {
    throw new Error(
      'getDataFromPointFeature: unable to find feature in sorted point features'
    );
  }

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
    .find((layer) => layer.get('id') === id);

export const getMultiLineStringFeature = (features) =>
  features.find(
    (feature) => feature.getGeometry().getType() === MULTI_LINE_STRING
  );

export const getPointFeatures = (features) =>
  features.filter((feature) => feature.getGeometry().getType() === POINT);

export const getSortedPointFeatures = (vectorLayer) => {
  const points = getPointFeatures(vectorLayer.getSource().getFeatures());
  const multiLine = getMultiLineStringFeature(
    vectorLayer.getSource().getFeatures()
  );
  if (!multiLine) {
    throw new Error(
      'getSortedPointFeatures: unable to find multiLine feature in gpx vector layer'
    );
  }
  const multiLineCoords = multiLine.getGeometry().getCoordinates()[0];
  const pointsInMultiLine = points.map((point) => {
    const closestPointInMultiLine = multiLine
      .getGeometry()
      .getClosestPoint(point.getGeometry().getCoordinates());
    const margin = 50; // meters
    const closesPointIndex = multiLineCoords.findIndex(
      (coord) =>
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

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

export const exportMapToPDF = async (
  map,
  format = 'a4',
  resolution = 150,
  reset = true,
  extent = null,
  pdf,
  onBeforeRender = () => {
    return undefined;
  }
) =>
  new Promise(async (resolve) => {
    if (!pdf) {
      const { default: JSPDF } = await import(
        /* webpackChunkName: "jspdf" */ 'jspdf'
      );
      // eslint-disable-next-line no-param-reassign
      pdf = new JSPDF('landscape', undefined, format);
    }
    const dim = dims[format];
    const size = map.getSize();
    const defaultExtent = map.getView().calculateExtent(size);

    map.once('rendercomplete', (event) => {
      const { canvas } = event.context;
      onBeforeRender(canvas);
      const data = canvas.toDataURL('image/jpeg');
      pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
      if (reset) {
        map.setSize(size);
        map.getView().fit(extent || defaultExtent, { size });
      }
      resolve(pdf);
    });

    const width = Math.round((dim[0] * resolution) / 25.4);
    const height = Math.round((dim[1] * resolution) / 25.4);
    const printSize = [width, height];

    map.setSize(printSize);
    map.getView().fit(extent || defaultExtent, { size: printSize });
  });
