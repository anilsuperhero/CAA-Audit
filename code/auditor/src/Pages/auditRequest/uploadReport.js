import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import SubmitButton from "../../Component/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import DropZone from "react-dropzone";
import { useDispatch } from "react-redux";
import { loadToasterData } from "../../actions/baseActions";
import { attech, PLUS } from "../../assets/img/index";
import {
  uploadReport,
  uploadNewReport,
} from "../../actions/auditRequestActions";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UploadReportDialog = (props) => {
  const { open, setOpen, item, stage } = props;
  const [selectedFile, setSelectedFile] = useState([]);
  const { register, errors, handleSubmit } = useForm();
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      dispatch(
        loadToasterData({
          open: true,
          message: "Please select only (.pdf, .jpg, .doc, .docx) format.",
          severity: "error",
        })
      );
      return false;
    }
    setSelectedFile(acceptedFiles);
  };

  const removeImage = () => {
    setSelectedFile([]);
  };

  const onSubmit = (data) => {
    if (selectedFile.length === 0) {
      dispatch(
        loadToasterData({
          open: true,
          message: "Please select document.",
          severity: "error",
        })
      );
      return false;
    }
    const formData = new FormData();
    formData.append("audit_id", item._id);
    formData.append("stage", stage);
    formData.append("remarks", data.remarks);
    formData.append("document", selectedFile[0]);

    if (item.status === "REPORT_REJECT_STAGE") {
      dispatch(uploadNewReport(formData, handleClose));
    } else {
      dispatch(uploadReport(formData, handleClose));
    }
  };

  return (
    <Fragment>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        className="upload-report"
      >
        <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Upload Report ({item.title})
          </DialogTitle>
          <DialogContent>
            <Row className="justify-content-center mx-auto">
              <Col md={12} lg={12}>
                <Form.Group controlId="formBasicRemarks">
                  <TextField
                    required
                    autoFocus={true}
                    id="outlined-remarks"
                    label="Remarks"
                    variant="outlined"
                    fullWidth
                    error={errors.remarks ? true : false}
                    name="remarks"
                    multiline
                    rows={4}
                    inputRef={register({
                      required: "Please enter remarks.",
                      minLength: {
                        value: 3,
                        message:
                          "Remarks should contain at least 3 characters.",
                      },
                    })}
                    helperText={errors.remarks && errors.remarks.message}
                  />
                </Form.Group>
                {/* {stage === 1 && (
                  <Form.Group controlId="RejectRemark">
                    Report Remarks:&nbsp;
                    <span className="text-danger">{item.report_remarks}</span>
                  </Form.Group>
                )}
                {(stage === 2 || stage === 3) && (
                  <Form.Group controlId="RejectRemark">
                    Report Remarks:&nbsp;
                    <span className="text-danger">
                      {item.report_remarks_stage}
                    </span>
                  </Form.Group>
                )} */}

                <Form.Group controlId="formBasicUpload">
                  <DropZone
                    accept=".pdf, .jpg, .doc, .docx"
                    multiple={false}
                    onDrop={handleDrop}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps({ className: "dropZone" })}>
                        <input {...getInputProps()} />
                        <p>
                          Upload file (you can only choose the following
                          .xlsx,.xls,.jpg,.jpeg,.png,.doc, .docx, .pdf) &nbsp;
                        </p>
                        <div>
                          <img
                            src={PLUS}
                            alt="Pdf fiels"
                            height="40px"
                            className="pb-2"
                          />
                        </div>
                        <small>Click to select file or Drag and Drop.</small>
                      </div>
                    )}
                  </DropZone>
                  {selectedFile.length !== 0 && (
                    <div className="Uploaded-image">
                      <div className="image_file_name">
                        <div className="image">
                          <img
                            src={attech}
                            alt="Pdf fiels"
                            height="60px"
                            className="p-2"
                          />
                          <span
                            onClick={removeImage}
                            className="nav-link-remove"
                          >
                            X
                          </span>
                        </div>
                        <div className="file_name">{selectedFile[0].name}</div>
                      </div>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </DialogContent>
          <DialogActions className="d-flex justify-content-start mb-4 ml-2">
            <Col md={2} sm={2} lg={3}>
              <SubmitButton title={"Submit"} />
            </Col>
          </DialogActions>
        </Form>
      </Dialog>
    </Fragment>
  );
};

export default UploadReportDialog;
