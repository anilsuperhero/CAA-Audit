import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import SubmitButton from "../../../Component/Button";
import Button from "@material-ui/core/Button";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme } from "../../../utils/helpers";
import { useForm } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DocumentList from "./list";
import DocumentDialog from "./documentForm";
import { useParams } from "react-router-dom";
import {
  getMultiDocument,
  updateDocumentStatus,
  multiDocumentUpload,
} from "../../../actions/documentAction";
import { useDispatch } from "react-redux";
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
  const { open, setOpen, itemDocument, documents } = props;
  const { register, errors, handleSubmit } = useForm();
  let { slug } = useParams();

  const onSubmit = (data) => {
    /**
     * Save Document
     */
    const formData = new FormData();
    formData.append("audit_id", slug);
    formData.append("staff_id", itemDocument._id);
    formData.append("status", 6);
    formData.append("type", "SECONDARY");
    formData.append("remarks", data.remarks);
    formData.append("description", data.remarks);
    dispatch(multiDocumentUpload(formData));

    const request = {};
    request.remarks = data.remarks;
    request.staff_id = itemDocument._id;
    request.status = 6;
    request.type = "SECONDARY";
    request.auditId = slug;
    dispatch(updateDocumentStatus(request, setOpen));
  };

  const submitClick = (type) => {
    const request = {};
    request.staff_id = itemDocument._id;
    request.status = type;
    request.type = "SECONDARY";
    request.auditId = slug;
    dispatch(updateDocumentStatus(request, setOpen));
  };
  const handleChange = (event) => {
    setApplicable(event.target.checked);
  };
  const [applicable, setApplicable] = useState(false);
  const [documentUpload, setDocumentUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState([]);

  const handleDocumentUploadClick = () => {
    setDocumentUpload(true);
  };

  const loadDocument = (data) => {
    setSelectedDocument(data);
    setDocumentUpload(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = () => {
      const request = {};
      request.audit_id = slug;
      request.staff_id = itemDocument._id;
      request.type = "SECONDARY";
      dispatch(getMultiDocument(request, setSelectedDocument));
    };
    if (itemDocument.status === 4) fetchData();
  }, [dispatch, itemDocument, slug]);

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
          {itemDocument.first_name}&nbsp;{itemDocument.last_name}
          <FormHelperText>&nbsp;</FormHelperText>
          <FormHelperText>&nbsp;</FormHelperText>
          <FormControlLabel
            control={
              <Checkbox
                checked={applicable}
                onChange={handleChange}
                name="applicable"
              />
            }
            label="Document not needed"
          />
          {!applicable && (
            <Button
              size="large"
              variant="contained"
              className="float-right"
              onClick={handleDocumentUploadClick}
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
                          rows={2}
                          inputRef={register({
                            required: "Please enter remarks.",
                            minLength: {
                              value: 3,
                              message:
                                "Remarks should contain at least 3 characters.",
                            },
                            maxLength: {
                              value: 150,
                              message:
                                "Remarks should not exceed 150 characters.",
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
                  <Col md={2} sm={2} lg={3}>
                    <SubmitButton title={"Submit"} />
                  </Col>
                </Row>
              </Form>
            </MuiThemeProvider>
          )}
          {selectedDocument.length > 0 && (
            <DocumentList
              selectedDocument={selectedDocument}
              itemDocument={itemDocument}
              documents={documents}
              setSelectedDocument={loadDocument}
              isUpdate={true}
            />
          )}
        </DialogContent>
        {selectedDocument.length > 0 && (
          <DialogActions className="d-flex justify-content-start">
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
          <DocumentDialog
            open={documentUpload}
            setOpen={setDocumentUpload}
            itemDocument={itemDocument}
            documents={documents}
            setSelectedDocument={loadDocument}
          />
        )}
      </Dialog>
    </div>
  );
};

export default FormDialog;
