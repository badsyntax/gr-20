import Control from 'ol/control/Control';

export default class ButtonControl extends Control {
  constructor(optOptions) {
    const options = optOptions || {};
    const { label, target } = options;

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control';
    element.appendChild(label);

    super({
      element,
      target,
    });
  }
}
