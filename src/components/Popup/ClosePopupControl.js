import PopupButtonControl from './PopupButtonControl';

import STYLES from './Popup.module.scss';

export default class ClosePopupControl extends PopupButtonControl {
  constructor(options) {
    super(options);
    this.element.classList.add(STYLES['Popup__close-button']);
  }
}
