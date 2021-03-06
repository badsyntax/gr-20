import { default as OLMap } from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, { Fragment, memo } from 'react';
// import { useDispatch } from 'react-redux';
// import { hideSpinner, showSpinner } from '../../../features/spinner';
// import GetAppIcon from '@material-ui/icons/GetApp';
import {
  // ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
// import { INPUT_TYPES } from '../../Form/Form';
// import ModalHeader from 'reactstrap/lib/ModalHeader';
// import Modal from 'reactstrap/lib/Modal';
// import ModalBody from 'reactstrap/lib/ModalBody';
// import Form from 'reactstrap/lib/Form';
// import FormGroup from 'reactstrap/lib/FormGroup';
// import Label from 'reactstrap/lib/Label';
// import Input from 'reactstrap/lib/Input';
// import Col from 'reactstrap/lib/Col';
// import Alert from 'reactstrap/lib/Alert';
// import Button from 'reactstrap/lib/Button';
// import { PDF_OPTION_ALL, PDF_OPTION_CURRENT } from '../../../util/constants';
import { PDFFormat } from '../../../util/types';

export interface DownloadControlButtonProps {
  map: OLMap;
  source: VectorSource;
}

export interface DownloadOptions {
  includeGPX: boolean;
  includePDF: boolean;
  pdfOption: 'all' | 'current';
  pdfFormat: PDFFormat;
  pdfResolution: number;
}

export const DownloadControlButton: React.FunctionComponent<
  DownloadControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = memo(({ map, source, ...rest }) => {
  // const [modalOpen, setModalOpen] = useState<boolean>(false);
  // const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
  //   includeGPX: true,
  //   includePDF: true,
  //   pdfOption: 'all',
  //   pdfFormat: 'a4',
  //   pdfResolution: 150,
  // });

  // const dispatch = useDispatch();

  // const onButtonCLick = () => {
  //   setModalOpen(true);
  // };

  // const onChange = (name: string, value: string | boolean) => {
  //   setDownloadOptions({
  //     ...downloadOptions,
  //     [name]: value,
  //   });
  // };

  // const onFieldChange = ({ target }: { target: HTMLInputElement }) => {
  //   const { name, type, checked, value: targetValue } = target;
  //   const value = type === INPUT_TYPES.checkbox ? checked : targetValue;
  //   onChange(name, value);
  // };

  // const download = async () => {
  //   const { downloadZipFile } = await import(
  //     /* webpackChunkName: "download-util" */ '../../../util/download'
  //   );
  //   const {
  //     pdfFormat,
  //     pdfResolution,
  //     includePDF,
  //     includeGPX,
  //     pdfOption,
  //   } = downloadOptions;
  //   await downloadZipFile(
  //     map,
  //     source,
  //     includeGPX,
  //     includePDF,
  //     pdfFormat,
  //     pdfResolution,
  //     pdfOption,
  //     () => dispatch(showSpinner()),
  //     () => dispatch(hideSpinner())
  //   );
  // };

  // const onDownloadButtonClick = () => {
  //   setModalOpen(false);
  //   void download(); // FIXME: handle error
  // };

  // const toggle = () => {
  //   setModalOpen(!modalOpen);
  // };

  return (
    <Fragment>
      {/* <ControlButton {...rest} onClick={onButtonCLick}>
        <GetAppIcon />
      </ControlButton> */}
      {/* <Modal isOpen={modalOpen} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Download Options</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="includeGPX"
                    checked={downloadOptions.includeGPX}
                    onChange={onFieldChange}
                  />{' '}
                  Include GPX
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="includePDF"
                    checked={downloadOptions.includePDF}
                    onChange={onFieldChange}
                  />{' '}
                  Include PDF
                </Label>
              </FormGroup>
              {downloadOptions.includePDF && (
                <FormGroup style={{ paddingLeft: '1.5em' }}>
                  <FormGroup row>
                    <Label for="pdfFormat" sm={4}>
                      Page size
                    </Label>
                    <Col sm={8}>
                      <Input
                        type="select"
                        id="pdfFormat"
                        onChange={onFieldChange}
                        name="pdfFormat"
                        value={downloadOptions.pdfFormat}
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
                        onChange={onFieldChange}
                        name="pdfResolution"
                        value={downloadOptions.pdfResolution}
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
                            checked={
                              downloadOptions.pdfOption === PDF_OPTION_ALL
                            }
                            onChange={onFieldChange}
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
                            checked={
                              downloadOptions.pdfOption === PDF_OPTION_CURRENT
                            }
                            onChange={onFieldChange}
                          />{' '}
                          Current View
                        </Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </FormGroup>
              )}
            </FormGroup>
            {downloadOptions.includePDF &&
              downloadOptions.pdfOption === PDF_OPTION_ALL && (
                <Alert color="warning">
                  Please note it might take some time to generate the PDF.
                </Alert>
              )}

            <Button
              onClick={onDownloadButtonClick}
              disabled={
                !downloadOptions.includeGPX && !downloadOptions.includePDF
              }
            >
              Download
            </Button>
          </Form>
        </ModalBody>
      </Modal> */}
    </Fragment>
  );
});
