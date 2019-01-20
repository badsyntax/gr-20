import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { IoMdDownload } from 'react-icons/io';
import Map from 'ol/Map';

import {
  Col,
  Form,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import ButtonControl from '../ButtonControl/ButtonControl';

import { downloadZipFile } from '../../util/downloadUtil';

const PDF_OPTION_ALL = 'all';
const PDF_OPTION_CURRENT = 'current';

class DownloadButtonControl extends Component {
  state = {
    modalOpen: false,
    values: {
      includeGPX: true,
      includePDF: true,
      pdfOption: 'all',
      pdfFormat: 'a4',
      pdfResolution: 150,
    },
  };

  onButtonCLick = async () => {
    this.setState({
      modalOpen: true,
    });
  };

  onFieldChange = ({ target }) => {
    const { name, type, checked, value: targetValue } = target;
    const value = type === 'checkbox' ? checked : targetValue;
    this.onChange(name, value);
  };

  onChange = (name, value) => {
    this.setState(({ values }) => ({
      values: {
        ...values,
        [name]: value,
      },
    }));
  };

  onDownloadButtonClick = () => {
    this.setState(
      {
        modalOpen: false,
      },
      () => this.download()
    );
  };

  toggle = () => {
    this.setState(({ modalOpen }) => ({
      modalOpen: !modalOpen,
    }));
  };

  async download() {
    const { map, showSpinner } = this.props;
    const { values } = this.state;
    const { pdfFormat, pdfResolution, includePDF, includeGPX } = values;
    showSpinner(true);
    await downloadZipFile(
      map,
      includeGPX,
      includePDF,
      pdfFormat,
      pdfResolution
    );
    showSpinner(false);
  }

  render() {
    const { modalOpen, values } = this.state;
    const { map, showSpinner, vectorLayer, ...rest } = this.props;
    return (
      <Fragment>
        <ButtonControl
          onClick={this.onButtonCLick}
          tooltipPlacement="right"
          {...rest}
        >
          <IoMdDownload />
        </ButtonControl>
        <Modal isOpen={modalOpen} toggle={this.toggle} centered>
          <ModalHeader toggle={this.toggle}>Download Options</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="includeGPX"
                      checked={values.includeGPX}
                      onChange={this.onFieldChange}
                    />{' '}
                    Include GPX
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="includePDF"
                      checked={values.includePDF}
                      onChange={this.onFieldChange}
                    />{' '}
                    Include PDF
                  </Label>
                </FormGroup>
                {values.includePDF && (
                  <FormGroup style={{ paddingLeft: '1.5em' }}>
                    <FormGroup row>
                      <Label for="pdfFormat" sm={4}>
                        Page size
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="select"
                          id="pdfFormat"
                          onChange={this.onFieldChange}
                          name="pdfFormat"
                          value={values.pdfFormat}
                        >
                          <option value="a0">A0 (slow)</option>
                          <option value="a1">A1</option>
                          <option value="a2">A2</option>
                          <option value="a3">A3</option>
                          <option value="a4">A4</option>
                          <option value="a5">A5 (fast)</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="pdfFormat" sm={4}>
                        Resolution
                      </Label>
                      <Col sm={8}>
                        <Input
                          type="select"
                          id="pdfResolution"
                          onChange={this.onFieldChange}
                          name="pdfResolution"
                          value={values.pdfResolution}
                        >
                          <option value="72">72 dpi (fast)</option>
                          <option value="150">150 dpi</option>
                          <option value="300">300 dpi (slow)</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm={4}>Pages</Label>
                      <Col sm={8}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="pdfOption"
                              value={PDF_OPTION_ALL}
                              checked={values.pdfOption === PDF_OPTION_ALL}
                              onChange={this.onFieldChange}
                            />{' '}
                            All Stages
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="pdfOption"
                              value={PDF_OPTION_CURRENT}
                              checked={values.pdfOption === PDF_OPTION_CURRENT}
                              onChange={this.onFieldChange}
                            />{' '}
                            Current View
                          </Label>
                        </FormGroup>
                      </Col>
                    </FormGroup>
                  </FormGroup>
                )}
              </FormGroup>
              {values.includePDF && values.pdfOption === PDF_OPTION_ALL && (
                <Alert color="warning">
                  Please note it might take some time to generate the PDF.
                </Alert>
              )}
              <Button onClick={this.onDownloadButtonClick}>Download</Button>
            </Form>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

DownloadButtonControl.propTypes = {
  showSpinner: PropTypes.func.isRequired,
  map: PropTypes.instanceOf(Map).isRequired,
};

export default DownloadButtonControl;
