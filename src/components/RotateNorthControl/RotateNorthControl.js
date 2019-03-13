import ButtonControl from '../ButtonControl/ButtonControl';

export default class RotateNorthControl extends ButtonControl {
  constructor(options) {
    super(options);
    this.element.firstChild.addEventListener(
      'click',
      this.onButtonCLick,
      false
    );
  }

  onButtonCLick = () => {
    this.getMap()
      .getView()
      .setRotation(0);
  };
}
