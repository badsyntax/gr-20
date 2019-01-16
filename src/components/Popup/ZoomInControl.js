import PopupButtonControl from './PopupButtonControl';

import STYLES from './Popup.module.scss';

export default class PrevPointControl extends PopupButtonControl {
  constructor(options) {
    super(options);
    this.element.classList.add(STYLES['Popup__zoom-button']);
  }
}
