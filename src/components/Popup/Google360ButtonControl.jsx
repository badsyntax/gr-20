import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import ButtonControl from '../ButtonControl/ButtonControl';
import { ReactComponent as Icon360 } from './360-24px.svg';

class Google360ButtonControl extends Component {
  state = {
    modalOpen: false,
  };

  toggle = () => {
    this.setState(({ modalOpen }) => ({
      modalOpen: !modalOpen,
    }));
  };

  render() {
    const { pointName, embedUrl, ...rest } = this.props;
    const { modalOpen } = this.state;
    return (
      <Fragment>
        <ButtonControl {...rest} onClick={this.toggle}>
          <Icon360 />
        </ButtonControl>
        <Modal
          isOpen={modalOpen}
          toggle={this.toggle}
          centered
          style={{ maxWidth: '800px' }}
        >
          <ModalHeader toggle={this.toggle}>{pointName} 360</ModalHeader>
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
  }
}

Google360ButtonControl.propTypes = {
  pointName: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
};

export default Google360ButtonControl;
