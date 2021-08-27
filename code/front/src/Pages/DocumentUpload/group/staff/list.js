import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import SubmitButton from "../../../../Component/Button";
import Button from "@material-ui/core/Button";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme } from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import SingleDocumentDialog from "./singleDocument";
import DocumentList from "./documentList";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getMultiDocument,
  updateDocumentStatus,
  submitMultiDocument,
} from "../../../../actions/documentAction";
import DialogActions from "@material-ui/core/DialogActions";

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

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#50663c",
    },
    "& .Mui-focused": {
      color: "#50663c",
    },
  },
});

const FormDialog = (props) => {
  const classes = useStyles();
  const {
    open,
    setOpen,
    itemDocument,
    registrationId,
    isDownload,
    staffId,
    applicable,
  } = props;
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const [documentUpload, setDocumentUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState([]);
  let { slug } = useParams();

  const onSubmit = (data) => {
    /**
     * Update Document
     */
    const formData = new FormData();
    formData.append("audit_id", slug);
    formData.append("document_id", itemDocument.id);
    formData.append("registration_id", registrationId);
    formData.append("staff_id", staffId);
    formData.append("status", 6);
    formData.append("type", "STAFF-MULTI");
    formData.append("description", data.remarks);
    formData.append("remarks", data.remarks);
    dispatch(submitMultiDocument(formData, loadDocumentMore, "STAFF-MULTI"));
  };

  const submitClick = (type) => {
    const request = {};
    request.registration_id = registrationId;
    request.staff_id = staffId;
    request.document_id = itemDocument.id;
    request.status = type;
    request.type = "STAFF-MULTI";
    request.auditId = slug;
    dispatch(updateDocumentStatus(request, setOpen));
  };

  useEffect(() => {
    const fetchData = () => {
      const request = {};
      request.audit_id = slug;
      request.registration_id = registrationId;
      request.staff_id = staffId;
      request.document_id = itemDocument.id;
      request.type = "STAFF-MULTI";
      dispatch(getMultiDocument(request, setSelectedDocument));
    };
    if (itemDocument.status === 4 || itemDocument.status === 2) fetchData();
  }, [dispatch, itemDocument, slug, registrationId, staffId]);

  const loadDocument = (data) => {
    setSelectedDocument(data);
    setDocumentUpload(false);
  };

  const loadDocumentMore = (data) => {
    setDocumentUpload(false);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        onClose={() => setOpen(false)}
        open={open}
        maxWidth={applicable ? "sm" : "md"}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {itemDocument.title}

          {!applicable && !isDownload && (
            <Button
              size="large"
              variant="contained"
              className="green_completed  mr-5 float-right"
              onClick={() => setDocumentUpload(true)}
            >
              Add New
            </Button>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {applicable && (
            <MuiThemeProvider theme={formLabelsTheme}>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
              >
                <Row className="justify-content-center mx-auto">
                  <Col md={12} lg={12}>
                    {applicable && (
                      <Form.Group controlId="formBasicRemarks">
                        <TextField
                          required
                          autoFocus={true}
                          id="outlined-remarks"
                          label="Remarks"
                          variant="outlined"
                          fullWidth
                          className={!errors.remarks ? classes.root : "w-100"}
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
                    )}
                  </Col>
                </Row>

                <Form.Control type="hidden" name="_id" ref={register({})} />
                <Row className="mt-2">
                  <Col md={2} sm={2} lg={3} className="ml-3">
                    <SubmitButton title={"Submit"} />
                  </Col>
                </Row>
              </Form>
            </MuiThemeProvider>
          )}
          {!applicable && selectedDocument.length > 0 && (
            <DocumentList
              selectedDocument={selectedDocument}
              itemDocument={itemDocument}
              registrationId={registrationId}
              setSelectedDocument={setSelectedDocument}
              isUpdate={true}
              staffId={staffId}
              isDownload={isDownload}
            />
          )}
        </DialogContent>
        {!applicable && selectedDocument.length > 0 && !isDownload && (
          <DialogActions className="d-flex justify-content-start ml-2">
            <Button
              variant="contained"
              size="large"
              color="primary"
              className="login-btn green-bg"
              onClick={() => submitClick(2)}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              size="large"
              className="login-btn"
              onClick={() => submitClick(4)}
            >
              SAVE FOR LATER
            </Button>
          </DialogActions>
        )}
        {documentUpload && (
          <SingleDocumentDialog
            open={documentUpload}
            setOpen={setDocumentUpload}
            itemDocument={itemDocument}
            registrationId={registrationId}
            setSelectedDocument={loadDocument}
            staffId={staffId}
          />
        )}
      </Dialog>
    </div>
  );
};

export default FormDialog;
