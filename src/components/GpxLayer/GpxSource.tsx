import GPX from 'ol/format/GPX';
import VectorLayer from 'ol/layer/Vector';
import STATE from 'ol/source/State';
import VectorSource from 'ol/source/Vector';
import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideSpinner, showSpinner } from '../../features/spinner';

const EXTENSIONS_TAG_NAME = 'gr20';

export interface GpxSourceProps {
  gpxUrl: string;
  vectorLayer: VectorLayer;
  onReady: (vectorSource: VectorSource) => void;
}

export const GpxSource: React.FunctionComponent<GpxSourceProps> = memo(
  ({ gpxUrl, vectorLayer, onReady }) => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(showSpinner());
      const format = new GPX({
        readExtensions(feature, extensionsNode) {
          feature.set('id', 'gpx-multiline-feature');
          if (!extensionsNode) {
            return;
          }
          const gr20Nodes = [
            ...Array.from(
              (extensionsNode as Element).getElementsByTagName(
                EXTENSIONS_TAG_NAME
              )
            ),
          ];
          gr20Nodes.forEach((node) => {
            const name = node.getAttribute('name');
            if (name) {
              const text = node.textContent;
              feature.setProperties({
                [name]: text,
              });
            }
          });
        },
      });
      const source = new VectorSource({
        url: gpxUrl,
        format,
      });
      vectorLayer.setSource(source);
      source.once('change', () => {
        if (source.getState() === STATE.READY) {
          dispatch(hideSpinner());
          onReady(source);
        }
      });

      return () => {
        source.dispose();
      };
    }, [dispatch, gpxUrl, onReady, vectorLayer]);
    return null;
  }
);
