import React from 'react';
import { FaTimes } from 'react-icons/fa';

import ButtonControl from '../ButtonControl/ButtonControl';
import STYLES from '../ButtonControl/ButtonControl.module.scss';

const CloseButtonControl = (props) => (
  <ButtonControl
    className={STYLES.ButtonControl__close}
    buttonClassName={STYLES['ButtonControl__close-button']}
    {...props}
  >
    <FaTimes />
  </ButtonControl>
);

export default CloseButtonControl;
