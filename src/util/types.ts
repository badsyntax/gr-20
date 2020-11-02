import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

export type PDFFormat = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5';

export type StageCoordinateIndex = number;

export interface Stage {
  coordIndexes: StageCoordinateIndex[];
  startFeature: Feature<Point>;
  endFeature: Feature<Point>;
}
