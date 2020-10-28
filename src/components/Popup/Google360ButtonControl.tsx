import React, { Fragment, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import {
  ButtonControl,
  ButtonControlProps,
} from '../ButtonControl/ButtonControl';
import { ReactComponent as Icon360 } from './360-24px.svg';

export interface Google360ButtonControlProps {
  pointName: string;
  embedUrl: string;
}

export const Google360ButtonControl: React.FunctionComponent<
  Google360ButtonControlProps & Omit<ButtonControlProps, 'onClick'>
> = ({ pointName, embedUrl, ...rest }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const toggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Fragment>
      <ButtonControl {...rest} onClick={toggle}>
        <Icon360 />
      </ButtonControl>
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

export default Google360ButtonControl;
