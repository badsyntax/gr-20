import { Component } from 'react'
import Map from 'ol/Map'
import PropTypes from 'prop-types'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'

import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'

import yellowMarker from './baseline-location_on-24px-yellow.svg'

const pointTextStyle = (text, marker, color) =>
  new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: marker,
    }),
    text: new Text({
      text,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: '#ffffff', width: 2 }),
      font: 'bold 13px Arial',
      offsetY: 12,
    }),
  })

const createPointTextFeature = (name, id, color, marker) => {
  const feature = new Feature({
    name,
  })
  feature.setId(id)
  feature.setStyle(pointTextStyle(name, marker, color))
  return feature
}

const getMultiLineStringFeature = layer =>
  layer
    .getSource()
    .getFeatures()
    .find(feature => feature.getGeometry().getType() === 'MultiLineString')

class StartEndLayer extends Component {
  componentDidMount() {
    const { map, vectorLayer } = this.props
    map.addLayer(vectorLayer)
    this.setLayerSource()
  }

  componentDidUpdate(prevProps) {
    const { showMarkers } = this.props
    if (prevProps.showMarkers !== showMarkers) {
      this.toggleMarkers(showMarkers)
    }
  }

  setLayerSource() {
    const { gpxVectorLayer, vectorLayer } = this.props

    const source = new VectorSource()
    source.addFeature(
      createPointTextFeature(
        'Start',
        'startPoint',
        'rgba(0,60,136)',
        yellowMarker
      )
    )
    source.addFeature(
      createPointTextFeature(
        'Finish',
        'finishPoint',
        'rgba(0,60,136)',
        yellowMarker
      )
    )
    vectorLayer.setSource(source)

    gpxVectorLayer.getSource().once('change', evt => {
      if (gpxVectorLayer.getSource().getState() === 'ready') {
        const multiLineString = getMultiLineStringFeature(gpxVectorLayer)
        const coords = multiLineString
          .getGeometry()
          .getCoordinates()[0]
          .slice()
        const startCoords = coords.shift()
        const endCoords = coords.pop()
        source.getFeatureById('startPoint').setGeometry(new Point(startCoords))
        source.getFeatureById('finishPoint').setGeometry(new Point(endCoords))
      }
    })
  }

  toggleMarkers(show) {
    const { vectorLayer } = this.props
    vectorLayer.setVisible(show)
  }

  render() {
    return null
  }
}

StartEndLayer.propTypes = {
  map: PropTypes.instanceOf(Map).isRequired,
  vectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,
  gpxVectorLayer: PropTypes.instanceOf(VectorLayer).isRequired,
  showMarkers: PropTypes.bool.isRequired,
}

export default StartEndLayer
