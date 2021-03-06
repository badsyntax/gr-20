import Tile from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { default as OLMap } from 'ol/Map';
import OSM from 'ol/source/OSM';
import React from 'react';
// import { MdLink } from 'react-icons/md';
import { getLayerById } from '../../../util/util';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';

export interface GetLinkControlButtonProps {
  map: OLMap;
}

export const GetLinkControlButton: React.FunctionComponent<
  GetLinkControlButtonProps &
    Omit<ControlButtonProps, 'onClick' | 'tooltipPlacement'>
> = ({ map, ...rest }) => {
  const onButtonCLick = () => {
    const gpxSource = getLayerById<VectorLayer>(
      map,
      'gpxvectorlayer'
    )?.getSource();
    const gpxUrl = gpxSource?.getUrl();
    if (!gpxUrl || typeof gpxUrl !== 'string') {
      return;
    }

    const tileLayerSource = getLayerById<Tile>(
      map,
      'osmtilelayer'
    )?.getSource() as OSM;
    const tileLayerUrl = tileLayerSource?.getUrls()[0];

    const { origin, pathname, hash } = new URL(window.location.toString());

    const searchParams = new URLSearchParams();
    searchParams.append('route', gpxUrl);
    searchParams.append('layer', tileLayerUrl);

    const url = `${origin}${pathname}?${searchParams.toString()}${hash}`;

    window.location.href = url;
  };

  return (
    <ControlButton {...rest} onClick={onButtonCLick}>
      Get link
    </ControlButton>
  );
};

export default GetLinkControlButton;
