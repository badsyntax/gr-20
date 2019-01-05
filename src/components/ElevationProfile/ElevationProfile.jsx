import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  XYPlot,
  LineSeries,
  // MarkSeries,
  AreaSeries,
  XAxis,
  YAxis
} from "react-vis";
import LineString from "ol/geom/LineString";
import VectorSource from "ol/source/Vector";

class ElevationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barX: 0,
      data: this.getData(),
      // markSeriesData: this.getMarkSeriesData(),
      showLine: false
    };
  }

  getMarkSeriesData() {
    const { source } = this.props;
    if (!source) {
      return [];
    }
    const points = source
      .getFeatures()
      .filter(feature => feature.getGeometry().getType() === "Point");
    let distanceFromStart = 0;
    return points.map((point, i) => {
      const coord = point.getGeometry().getCoordinates();
      const distance =
        i === 0
          ? 0
          : new LineString([
              points[i - 1].getGeometry().getCoordinates(),
              coord
            ]).getLength();

      distanceFromStart += distance;
      return {
        x: distanceFromStart / 1000,
        y: Math.round(coord[2])
      };
    });
  }

  getData() {
    const { source, minDistanceThreshold } = this.props;
    if (!source) {
      return [];
    }
    const features = source.getFeatures();
    let data = [];
    features.forEach(feature => {
      if (feature.getGeometry().getType() === "MultiLineString") {
        const coords = feature.getGeometry().getCoordinates()[0];
        let curMinDistance = 0;
        let distanceFromStart = 0;
        const points = coords
          .map((coord, i) => {
            const distance =
              i === 0 ? 0 : new LineString([coords[i - 1], coord]).getLength();
            distanceFromStart += distance;
            return {
              coord,
              distance,
              distanceFromStart
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
        data = data.concat(
          points.map((point, i) => ({
            x: point.distanceFromStart / 1000,
            y: Math.round(point.coord[2])
          }))
        );
      }
    });
    return data;
  }

  render() {
    const { data, barX, showLine } = this.state;
    const yMax = Math.max(...data.map(e => e.y)) || 0;
    const hoverLineData = [
      {
        x: barX,
        y: 0
      },
      {
        x: barX,
        y: yMax
      }
    ];

    return (
      <div className="Profile">
        <XYPlot
          height={140}
          width={600}
          margin={{ left: 60, right: 20, bottom: 40 }}
          onMouseEnter={() => {
            this.setState({
              showLine: true
            });
          }}
          onMouseLeave={() => {
            this.setState({
              showLine: false
            });
          }}
        >
          <XAxis
            attr="x"
            attrAxis="y"
            orientation="bottom"
            title="Distance (km)"
          />
          <YAxis attr="y" attrAxis="x" orientation="left" title="Height (m)" />
          {/* <MarkSeries data={markSeriesData} /> */}
          <AreaSeries
            data={data}
            style={{ strokeWidth: "1" }}
            strokeStyle="solid"
            color="rgba(0,60,136,0.5)"
            stroke="rgb(0,60,136)"
            onNearestX={(datapoint, event) => {
              this.setState({
                barX: datapoint.x
              });
            }}
          />
          {showLine && <LineSeries data={hoverLineData} />}
        </XYPlot>
      </div>
    );
  }
}

ElevationProfile.propTypes = {
  source: PropTypes.instanceOf(VectorSource).isRequired,
  minDistanceThreshold: PropTypes.number
};

ElevationProfile.defaultProps = {
  minDistanceThreshold: 800
};

export default ElevationProfile;
