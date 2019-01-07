import React, { Component } from "react";
import PropTypes from "prop-types";

import XYPlot from "react-vis/es/plot/xy-plot";
import AreaSeries from "react-vis/es/plot/series/area-series";
import LineSeries from "react-vis/es/plot/series/line-series";
import XAxis from "react-vis/es/plot/axis/x-axis";
import YAxis from "react-vis/es/plot/axis/y-axis";

import LineString from "ol/geom/LineString";
import VectorSource from "ol/source/Vector";

import STYLES from "./ElevationProfile.module.scss";

class ElevationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      yMax: 0,
      showLine: false,
      hoverLineData: []
    };
  }

  componentDidMount() {
    this.setDataFromMultiLinePoints();
  }

  componentDidUpdate(prevProps) {
    const { source } = this.props;
    if (prevProps.source !== source) {
      this.setDataFromMultiLinePoints();
    }
  }

  setDataFromMultiLinePoints() {
    const { source, minDistanceThreshold } = this.props;
    const features = source.getFeatures();
    let data = [];
    features.forEach(feature => {
      if (feature.getGeometry().getType() !== "MultiLineString") {
        return;
      }
      const coords = feature.getGeometry().getCoordinates()[0];
      let curMinDistance = 0;
      let distanceFromStart = 0;
      const points = coords
        .map((coord, i) => {
          const distance =
            i === 0 ? 0 : new LineString([coords[i - 1], coord]).getLength(); // meter
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
          x: point.distanceFromStart / 1000, // km
          y: Math.round(point.coord[2])
        }))
      );
    });

    const yMax = Math.max(...data.map(e => e.y)) || 0;

    this.setState({
      data,
      yMax
    });
  }

  onAreaSeriesNearestX = (datapoint, event) => {
    const { yMax } = this.state;
    const barX = datapoint.x;
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
    this.setState({
      hoverLineData
    });
  };

  onMouseEnter = () => {
    this.setState({
      showLine: true
    });
  };

  onMouseLeave = () => {
    this.setState({
      showLine: false
    });
  };

  render() {
    const { data, showLine, hoverLineData } = this.state;
    return (
      <div className={STYLES.ElevationProfile}>
        <XYPlot
          height={140}
          width={600}
          margin={{ left: 60, right: 20, bottom: 40 }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <XAxis
            attr="x"
            attrAxis="y"
            orientation="bottom"
            title="Distance (km)"
            style={{
              line: { stroke: "#999999", strokeWidth: 1 },
              ticks: { stroke: "#999999", strokeWidth: 1 },
              text: { stroke: "none", fill: "#111111" }
            }}
          />
          <YAxis
            attr="y"
            attrAxis="x"
            orientation="left"
            title="Height (m)"
            style={{
              line: { stroke: "#999999", strokeWidth: 1 },
              ticks: { stroke: "#999999", strokeWidth: 1 },
              text: { stroke: "none", fill: "#111111" }
            }}
          />
          <AreaSeries
            data={data}
            style={{ strokeWidth: "1" }}
            strokeStyle="solid"
            color="rgba(0,60,136,0.5)"
            stroke="rgb(0,60,136)"
            onNearestX={this.onAreaSeriesNearestX}
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
