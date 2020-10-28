import React, { memo } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';
import STYLES from '../ButtonControl/ButtonControl.module.scss';

export const CloseButtonControl: React.FunctionComponent<Omit<
  ButtonControlProps,
  'className' | 'buttonClassName'
>> = memo((props) => (
  <ButtonControl
    className={STYLES.ButtonControl__close}
    buttonClassName={STYLES['ButtonControl__close-button']}
    {...props}
  >
    <FaTimes />
  </ButtonControl>
));
