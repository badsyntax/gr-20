import React, { memo } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import STYLES from '../ControlButton/ControlButton.module.scss';

export const CloseControlButton: React.FunctionComponent<Omit<
  ControlButtonProps,
  'className' | 'buttonClassName'
>> = memo((props) => (
  <ControlButton
    className={STYLES.ControlButton__close}
    buttonClassName={STYLES['ControlButton__close-button']}
    {...props}
  >
    <FaTimes />
  </ControlButton>
));
