import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer/AutoSizer'
import Map from 'ol/Map'
import XYPlot from 'react-vis/es/plot/xy-plot'
import AreaSeries from 'react-vis/es/plot/series/area-series'
import LineSeries from 'react-vis/es/plot/series/line-series'
import { Vector as VectorLayer } from 'ol/layer'
import XAxis from 'react-vis/es/plot/axis/x-axis'
import YAxis from 'react-vis/es/plot/axis/y-axis'
import Icon from 'ol/style/Icon'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Feature from 'ol/Feature'
import VectorSource from 'ol/source/Vector'
import markerIcon from '../GpxLayer/marker-gold.png'

import { sampleCoordinates, getMultiLineStringFeature } from '../../util/util'

import STYLES from './ElevationProfile.module.scss'

const positionMarketStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    src: markerIcon,
  }),
})

const createPositionMarkerFeature = () => {
  const feature = new Feature({
    name: 'Current position',
  })
  feature.setId('position')
  feature.setStyle(positionMarketStyle)
  return feature
}

class ElevationProfile extends Component {
  constructor(props) {
    super(props)
    this.positionVectorLayer = new VectorLayer()
    this.state = {
      data: [],
      yMax: null,
      yMin: null,
      showLine: false,
      hoverLineData: [],
    }
  }

  componentDidMount() {
    const { map } = this.props
    map.addLayer(this.positionVectorLayer)
    this.setDataFromMultiLinePoints()
  }

  componentDidUpdate(prevProps) {
    const { source } = this.props
    if (prevProps.source !== source) {
      this.setDataFromMultiLinePoints()
    }
  }

  componentWillUnmount() {
    const { map } = this.props
    map.removeLayer(this.positionVectorLayer)
  }

  setDataFromMultiLinePoints() {
    const { source, minDistanceThreshold } = this.props

    const positionSource = new VectorSource({
      features: [createPositionMarkerFeature()],
    })
    this.positionVectorLayer.setSource(positionSource)

    const multiLineStringFeature = getMultiLineStringFeature(
      source.getFeatures()
    )
    const coords = multiLineStringFeature.getGeometry().getCoordinates()[0]
    const points = sampleCoordinates(coords, minDistanceThreshold)

    const data = points.map((point, i) => ({
      x: point.distanceFromStart / 1000, // km
      y: point.coord[2],
    }))

    const yMax = Math.max(...data.map(e => e.y)) || 0
    const yMin = Math.min(...data.map(e => e.y)) || 0

    this.setState({
      data,
      yMax,
      yMin,
      sampledPoints: points,
    })
  }

  setPositionMarkerGeometry(geometry) {
    this.positionVectorLayer
      .getSource()
      .getFeatureById('position')
      .setGeometry(geometry)
  }

  onAreaSeriesNearestX = (datapoint, event) => {
    const { yMax, yMin, data, sampledPoints } = this.state

    const foundPointIndex = data.indexOf(datapoint)
    const { coord } = sampledPoints[foundPointIndex]
    this.setPositionMarkerGeometry(new Point(coord))

    const { x: barX } = datapoint
    const hoverLineData = [
      {
        x: barX,
        y: yMin,
      },
      {
        x: barX,
        y: yMax,
      },
    ]
    this.setState({
      hoverLineData,
    })
  }

  onMouseEnter = () => {
    this.setState({
      showLine: true,
    })
  }

  onMouseLeave = () => {
    this.setPositionMarkerGeometry(null)
    this.setState({
      showLine: false,
    })
  }

  render() {
    const { data, showLine, hoverLineData } = this.state
    return (
      <div className={STYLES.ElevationProfile}>
        <AutoSizer>
          {({ height, width }) => {
            const sampleRatio = Math.ceil(600 / window.innerWidth)
            const sampledDataByScreenSize = data.filter(
              (point, index) => !index || index % sampleRatio === 0
            )
            return (
              <XYPlot
                height={height}
                width={width}
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
                    line: { stroke: '#999999', strokeWidth: 1 },
                    ticks: { stroke: '#999999', strokeWidth: 1 },
                    text: { stroke: 'none', fill: '#111111' },
                  }}
                />
                <YAxis
                  attr="y"
                  attrAxis="x"
                  orientation="left"
                  title="Height (m)"
                  style={{
                    line: { stroke: '#999999', strokeWidth: 1 },
                    ticks: { stroke: '#999999', strokeWidth: 1 },
                    text: { stroke: 'none', fill: '#111111' },
                  }}
                />
                <AreaSeries
                  data={sampledDataByScreenSize}
                  style={{ strokeWidth: '1' }}
                  strokeStyle="solid"
                  color="rgba(0,60,136,0.5)"
                  stroke="rgb(0,60,136)"
                  onNearestX={this.onAreaSeriesNearestX}
                />
                {showLine && <LineSeries data={hoverLineData} />}
              </XYPlot>
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}

ElevationProfile.propTypes = {
  source: PropTypes.instanceOf(VectorSource).isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
  minDistanceThreshold: PropTypes.number,
}

ElevationProfile.defaultProps = {
  minDistanceThreshold: 800,
}

export default ElevationProfile
