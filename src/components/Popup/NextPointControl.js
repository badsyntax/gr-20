import PopupButtonControl from './PopupButtonControl';

import STYLES from './Popup.module.scss';

export default class NextPointControl extends PopupButtonControl {
  constructor(options) {
    super(options);
    this.element.classList.add(STYLES['Popup__next-button']);
  }
}
