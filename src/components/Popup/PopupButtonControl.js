import ButtonControl from '../ButtonControl/ButtonControl';

export default class PopupButtonControl extends ButtonControl {
  constructor(options) {
    super(options);
    this.element.firstChild.addEventListener(
      'click',
      this.onButtonCLick,
      false
    );
  }

  onButtonCLick = e => {
    this.onClick(e);
  };

  setOnClick(func) {
    this.onClick = func;
  }
}
