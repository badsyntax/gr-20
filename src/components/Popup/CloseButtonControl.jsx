import React from 'react';
import { MdClose } from 'react-icons/md';

import ButtonControl from '../ButtonControl/ButtonControl';
import STYLES from '../ButtonControl/ButtonControl.module.scss';

const CloseButtonControl = props => (
  <ButtonControl className={STYLES.ButtonControl__close} {...props}>
    <MdClose />
  </ButtonControl>
);

export default CloseButtonControl;
