import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import attach from "../../../assets/images/attach.png";
import { downloadFile } from "../../../utils/helpers";

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

const ViewReportDialog = (props) => {
  const { open, setOpen, item, stage } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadClick = () => {
    if (stage === 1) {
      downloadFile(item.report, item.report_name);
    }
    if (stage === 2) {
      downloadFile(item.report_stage, item.report_name_stage);
    }
  };

  return (
    <Fragment>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          View Report ({item.title})
        </DialogTitle>
        <DialogContent>
          <Row className="justify-content-center mx-auto">
            {stage === 1 && (
              <Col md={12} lg={12}>
                <Form.Group controlId="formBasicRemarks">
                  <TextField
                    required
                    autoFocus={true}
                    id="outlined-remarks"
                    label="Remarks"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    defaultValue={item.report_remarks}
                    name="remarks"
                    multiline
                    rows={2}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicUpload">
                  {item.report_name && (
                    <div className="Uploaded-image">
                      <div className="image_file_name">
                        <div className="image">
                          <img
                            src={attach}
                            alt="Pdf fiels"
                            height="60px"
                            className="p-2 tableHead"
                            onClick={handleDownloadClick}
                          />
                        </div>
                        <div className="file_name">{item.report_name}</div>
                      </div>
                    </div>
                  )}
                </Form.Group>
              </Col>
            )}
            {stage === 2 && (
              <Col md={12} lg={12}>
                <Form.Group controlId="formBasicRemarks">
                  <TextField
                    required
                    autoFocus={true}
                    id="outlined-remarks"
                    label="Remarks"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    defaultValue={item.report_remarks_stage}
                    name="remarks"
                    multiline
                    rows={2}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicUpload">
                  {item.report_name_stage && (
                    <div className="Uploaded-image">
                      <div className="image_file_name">
                        <div className="image">
                          <img
                            src={attach}
                            alt="Pdf fiels"
                            height="60px"
                            className="p-2 tableHead"
                            onClick={handleDownloadClick}
                          />
                        </div>
                        <div className="file_name">
                          {item.report_name_stage}
                        </div>
                      </div>
                    </div>
                  )}
                </Form.Group>
              </Col>
            )}
          </Row>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ViewReportDialog;
