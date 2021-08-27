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
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { downloadFile } from "../../utils/helpers";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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
  const { open, setOpen, item, stage } = props;
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadClick = (stage) => {
    if (parseInt(stage) === 1) {
      downloadFile(item.report, item.report_name);
    } else {
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
          {parseInt(stage) === 1 && (
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
                    rows={2}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicUpload">
                  {item.report_name && (
                    <div className="Uploaded-image">
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={() => handleDownloadClick(1)}
                        startIcon={<CloudDownloadIcon />}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}
          {parseInt(stage) === 2 && (
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
                  {item.report_stage && (
                    <div className="Uploaded-image">
                      <div className="image_file_name">
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={() => handleDownloadClick(2)}
                          startIcon={<CloudDownloadIcon />}
                        >
                          Download
                        </Button>
                      </div>
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
