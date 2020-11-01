import { default as OLMap } from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import React, { Fragment, memo, useState } from 'react';
import {
  ControlButton,
  ControlButtonProps,
} from '../ControlButton/ControlButton';
import { PDFFormat } from '../../../util/types';
import GetAppIcon from '@material-ui/icons/GetApp';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { PDF_OPTION_ALL, PDF_OPTION_CURRENT } from '../../../util/constants';
import { useStyles } from './DownloadControlButtonStyles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { hideSpinner, showSpinner } from '../../../features/spinner';
import { useDispatch } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

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

const defaultOptions: DownloadOptions = {
  includeGPX: true,
  includePDF: true,
  pdfOption: 'all',
  pdfFormat: 'a4',
  pdfResolution: 150,
};

export const DownloadControlButton: React.FunctionComponent<
  DownloadControlButtonProps & Omit<ControlButtonProps, 'onClick'>
> = memo(({ map, source, ...rest }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>(
    defaultOptions
  );

  const dispatch = useDispatch();

  const onButtonCLick = () => {
    setModalOpen(true);
  };

  const onFieldChange = ({
    target,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ChangeEvent<Record<string, any>>) => {
    const { name, type, checked, value } = target;
    setDownloadOptions({
      ...downloadOptions,
      [name as string]: type === 'checkbox' ? checked : value,
    });
  };

  const download = async () => {
    const { downloadZipFile } = await import(
      /* webpackChunkName: "download-util" */ '../../../util/download'
    );
    const {
      pdfFormat,
      pdfResolution,
      includePDF,
      includeGPX,
      pdfOption,
    } = downloadOptions;
    await downloadZipFile(
      map,
      source,
      includeGPX,
      includePDF,
      pdfFormat,
      pdfResolution,
      pdfOption,
      () => dispatch(showSpinner()),
      () => dispatch(hideSpinner())
    );
  };

  const onDownloadButtonClick = () => {
    setModalOpen(false);
    void download(); // FIXME: handle error
  };

  const onClose = () => {
    setModalOpen(false);
  };

  const reset = () => {
    setDownloadOptions(defaultOptions);
  };

  return (
    <Fragment>
      <ControlButton {...rest} onClick={onButtonCLick}>
        <GetAppIcon />
      </ControlButton>
      <Dialog open={modalOpen} onClose={onClose} onExited={reset}>
        {/* <Modal isOpen={modalOpen} toggle={toggle} centered> */}
        {/* <ModalHeader toggle={toggle}>Download Options</ModalHeader> */}
        <DialogTitle id="form-dialog-title">Download Options</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <FormControl fullWidth>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={onFieldChange}
                    color="primary"
                    name="includeGPX"
                    checked={downloadOptions.includeGPX}
                  />
                }
                key="include-gpx"
                label="  Include GPX"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="includePDF"
                    checked={downloadOptions.includePDF}
                    onChange={onFieldChange}
                  />
                }
                key="include-pdf"
                label="Include PDF"
              />
            </FormGroup>
          </FormControl>

          {downloadOptions.includePDF && (
            <Fragment>
              <FormControl margin="normal" fullWidth>
                <InputLabel id="page-size-label">Page size</InputLabel>
                <Select
                  labelId="page-size-label"
                  value={downloadOptions.pdfFormat}
                  name="pdfFormat"
                  onChange={onFieldChange}
                >
                  <MenuItem value="a0">A0 (slow)</MenuItem>
                  <MenuItem value="a1">A1</MenuItem>
                  <MenuItem value="a2">A2</MenuItem>
                  <MenuItem value="a3">A3</MenuItem>
                  <MenuItem value="a4">A4</MenuItem>
                  <MenuItem value="a5">A5 (fast)</MenuItem>
                </Select>
              </FormControl>
              <FormControl margin="normal" fullWidth>
                <InputLabel id="page-size-resolution">Resolution</InputLabel>
                <Select
                  labelId="page-size-resolution"
                  value={downloadOptions.pdfResolution}
                  name="pdfResolution"
                  onChange={onFieldChange}
                >
                  <MenuItem value="72">72 dpi (fast)</MenuItem>
                  <MenuItem value="150">150 dpi</MenuItem>
                  <MenuItem value="300">300 dpi (slow)</MenuItem>
                </Select>
              </FormControl>
              <FormControl margin="normal" fullWidth component="fieldset">
                <FormLabel component="legend">Pages</FormLabel>
                <RadioGroup
                  name="pdfOption"
                  value={downloadOptions.pdfOption}
                  onChange={onFieldChange}
                >
                  <FormControlLabel
                    value={PDF_OPTION_ALL}
                    control={<Radio />}
                    label="All Stages"
                  />
                  <FormControlLabel
                    value={PDF_OPTION_CURRENT}
                    control={<Radio />}
                    label="Current View"
                  />
                </RadioGroup>
              </FormControl>
            </Fragment>
          )}
          {downloadOptions.includePDF &&
            downloadOptions.pdfOption === PDF_OPTION_ALL && (
              <Fade in>
                <Alert severity="warning">
                  Please note it might take some time to generate the PDF.
                </Alert>
              </Fade>
            )}
          {/*
          <Button
            onClick={onDownloadButtonClick}
            disabled={
              !downloadOptions.includeGPX && !downloadOptions.includePDF
            }
          >
            Download
          </Button>  */}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            size="large"
            startIcon={<GetAppIcon />}
            onClick={onDownloadButtonClick}
            disabled={
              !downloadOptions.includeGPX && !downloadOptions.includePDF
            }
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});
