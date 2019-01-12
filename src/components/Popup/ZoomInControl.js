/* eslint-disable no-underscore-dangle */
import Control from 'ol/control/Control'
import STYLES from './Popup.module.scss'

export default class ZoomInControl extends Control {
  constructor(optOptions) {
    const options = optOptions || {}

    const button = document.createElement('button')
    button.appendChild(options.label)
    button.setAttribute('title', 'Close')

    const element = document.createElement('div')
    element.className = 'ol-unselectable ol-control'
    element.classList.add(STYLES['Popup__zoom-button'])
    element.appendChild(button)

    super({
      element,
      target: options.target,
    })

    this._onClick = () => {}
    button.addEventListener('click', this.onClick, false)
  }

  onClick = e => {
    this._onClick(e)
  }

  setOnClick(func) {
    this._onClick = func
  }
}
