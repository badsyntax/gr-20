import Tile from 'ol/layer/Tile';
import { default as OLMap } from 'ol/Map';
import OSM from 'ol/source/OSM';
import { expandUrl } from 'ol/tileurlfunction';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import maps from '../../data/maps/maps.json';

const urls = maps.map(({ url }) => expandUrl(url)).flat();

export interface TileLayerProps {
  map: OLMap;
  mapUrl: string;
}

export class TileLayer extends Component<TileLayerProps> {
  private xyzSource: OSM;
  private rasterLayer: Tile;
  constructor(props: TileLayerProps) {
    super(props);
    this.xyzSource = new OSM();
    this.rasterLayer = new Tile({
      source: this.xyzSource,
    });
    this.rasterLayer.set('id', 'osmtilelayer');
  }

  componentDidMount(): void {
    const { map, mapUrl } = this.props;
    map.addLayer(this.rasterLayer);
    this.xyzSource.setUrl(mapUrl);
  }

  componentDidUpdate(): void {
    const { mapUrl } = this.props;
    this.xyzSource.setUrl(mapUrl);
  }

  componentWillUnmount(): void {
    const { map } = this.props;
    map.removeLayer(this.rasterLayer);
  }

  render(): React.ReactNode {
    return (
      <Helmet>
        {urls.map((url) => (
          <link key={url} href={new URL(url).origin} rel="preconnect" />
        ))}
      </Helmet>
    );
  }
}
