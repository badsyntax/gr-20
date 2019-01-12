import Control from 'ol/control/Control';

export default class RotateNorthControl extends Control {
  constructor(optOptions) {
    const options = optOptions || {};

    const button = document.createElement('button');
    button.appendChild(options.label);
    button.setAttribute('title', 'Rotate north');

    const element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element,
      target: options.target,
    });

    button.addEventListener('click', this.handleRotateNorth, false);
  }

  handleRotateNorth = () => {
    this.getMap()
      .getView()
      .setRotation(0);
  };
}
