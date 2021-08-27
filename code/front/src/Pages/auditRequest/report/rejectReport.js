import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import SubmitButton from "../../../Component/Button";
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
import { useDispatch } from "react-redux";
import { rejectReportAction } from "../../../actions/auditRequestActions";

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

const RejectReportDialog = (props) => {
  const { open, setOpen, item, setViewReport } = props;

  const { register, errors, handleSubmit } = useForm();
  const handleClose = () => {
    setViewReport(false);
    setOpen(false);
  };
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    data.audit_id = item._id;
    dispatch(rejectReportAction(data, handleClose));
  };

  return (
    <Fragment>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Reject Report ({item.title})
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
                    rows={8}
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

export default RejectReportDialog;
