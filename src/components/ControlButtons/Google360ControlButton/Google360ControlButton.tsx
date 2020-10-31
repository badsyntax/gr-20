import Portal from '@material-ui/core/Portal';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useState } from 'react';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import { ReactComponent as Icon360 } from './360-24px.svg';

export interface Google360ControlButtonProps {
  pointName: string;
  embedUrl: string;
}

const useStyles = makeStyles({
  iframe: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 380,
    right: 0,
    height: '100%',
  },
});

export const Google360ControlButton: React.FunctionComponent<
  Google360ControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = ({ pointName, embedUrl, ...rest }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const toggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Fragment>
      <ControlButton {...rest} onClick={toggle}>
        <Icon360 />
      </ControlButton>
      {modalOpen && (
        <Portal container={document.body}>
          <iframe
            title="Google Maps 360"
            src={embedUrl}
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            className={classes.iframe}
          />
        </Portal>
      )}
      {/* <Modal
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
      </Modal> */}
    </Fragment>
  );
};
