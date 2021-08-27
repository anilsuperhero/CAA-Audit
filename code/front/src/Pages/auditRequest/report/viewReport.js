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
import { downloadFile } from "../../../utils/helpers";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

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

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

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
  const {
    open,
    setOpen,
    item,
    stage,
    handleRejectReport,
    handleAcceptClick,
    handleRejectReportStage,
  } = props;
  const classes = useStyles();
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
          Report acceptance / rejection ({item.title})
        </DialogTitle>
        <DialogContent>
          {stage === 1 && (
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
                    InputProps={{
                      readOnly: true,
                    }}
                    defaultValue={item.report_remarks}
                    name="remarks"
                    multiline
                    rows={6}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicUpload">
                  {item.report_name && (
                    <div className="Uploaded-image">
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.button}
                        onClick={handleDownloadClick}
                        startIcon={<CloudDownloadIcon />}
                      >
                        Download
                      </Button>
                      {item.status === "REPORT_UPLOAD" && (
                        <Fragment>
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            className="login-btn green-bg"
                            onClick={() => handleAcceptClick(item)}
                            startIcon={<CheckCircleIcon />}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            className={classes.button}
                            onClick={handleRejectReport}
                            startIcon={<HighlightOffIcon />}
                          >
                            Reject
                          </Button>
                        </Fragment>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}
          {stage === 2 && (
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
                      <Button
                        size="large"
                        variant="contained"
                        className={classes.button}
                        onClick={handleDownloadClick}
                        startIcon={<CloudDownloadIcon />}
                      >
                        Download
                      </Button>

                      {item.status === "SEND_REPORT_COMPANY" && (
                        <Fragment>
                          <Button
                            size="large"
                            variant="contained"
                            color="inherit"
                            className={classes.button}
                            onClick={() => handleAcceptClick(item)}
                            startIcon={<CheckCircleIcon />}
                          >
                            Accept
                          </Button>
                          <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={handleRejectReportStage}
                            startIcon={<HighlightOffIcon />}
                          >
                            Reject
                          </Button>
                        </Fragment>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ViewReportDialog;
