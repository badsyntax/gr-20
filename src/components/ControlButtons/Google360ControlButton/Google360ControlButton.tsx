import React, { Fragment, useState } from 'react';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import { ReactComponent as Icon360 } from './360-24px.svg';

export interface Google360ControlButtonProps {
  pointName: string;
  embedUrl: string;
}

export const Google360ControlButton: React.FunctionComponent<
  Google360ControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = ({ pointName, embedUrl, ...rest }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const toggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Fragment>
      <ControlButton {...rest} onClick={toggle}>
        <Icon360 />
      </ControlButton>
      <Modal
        isOpen={modalOpen}
        toggle={toggle}
        centered
        style={{ maxWidth: '800px' }}
      >
        <ModalHeader toggle={toggle}>{pointName} 360</ModalHeader>
        <ModalBody>
          <iframe
            title="Google Maps 360"
            src={embedUrl}
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default Google360ControlButton;
