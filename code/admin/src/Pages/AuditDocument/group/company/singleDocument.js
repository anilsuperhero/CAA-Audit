import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import SubmitButton from "../../../../Component/Button";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme } from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import { loadTosterData } from "../../../../actions/baseActions";
import DropZone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  singleDocument,
  getMultiDocument,
} from "../../../../actions/documentAction";

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
  const { open, setOpen, itemDocument, registrationId, setSelectedDocument } =
    props;
  const { register, errors, handleSubmit, getValues } = useForm();
  const dispatch = useDispatch();
  let { slug } = useParams();
  const [selectedFile, setSelectedFile] = useState([]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      dispatch(
        loadTosterData({
          open: true,
          message:
            "Please select only ( " +
            itemDocument.extension.toString() +
            " ) format.",
          severity: "error",
        })
      );
      return false;
    }
    setSelectedFile(acceptedFiles);
  };

  const onSubmit = (data) => {
    if (selectedFile.length === 0) {
      dispatch(
        loadTosterData({
          open: true,
          message: "Please select document.",
          severity: "error",
        })
      );
      return false;
    }
    const formData = new FormData();
    formData.append("audit_id", slug);
    formData.append("document_id", itemDocument.id);
    formData.append("registration_id", registrationId);
    formData.append("document_name", getValues("name"));
    formData.append("document", selectedFile[0]);
    formData.append("status", 1);
    formData.append("type", "COMPANY-MULTI");
    formData.append("description", getValues("description"));
    dispatch(singleDocument(formData, loadDocument, "COMPANY-MULTI"));
  };

  const loadDocument = () => {
    const request = {};
    request.audit_id = slug;
    request.registration_id = registrationId;
    request.document_id = itemDocument.id;
    request.type = "COMPANY-MULTI";
    dispatch(getMultiDocument(request, setSelectedDocument));
  };

  return (
    <div>
      <Dialog fullWidth={true} onClose={() => setOpen(false)} open={open}>
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {itemDocument.title}
        </DialogTitle>
        <DialogContent dividers>
          <MuiThemeProvider theme={formLabelsTheme}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Row className="justify-content-center mx-auto">
                <Col md={12} lg={12}>
                  <Form.Group controlId="formBasicName">
                    <TextField
                      autoFocus={true}
                      required
                      defaultValue={itemDocument.title}
                      id="outlined-name"
                      label="Name of document"
                      variant="outlined"
                      fullWidth
                      className={!errors.name ? classes.root : "w-100"}
                      error={errors.name ? true : false}
                      name="name"
                      inputRef={register({
                        required: "Please enter name.",
                        minLength: {
                          value: 3,
                          message: "Name should contain at least 3 characters.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name should not exceed 50 characters.",
                        },
                      })}
                      helperText={errors.name && errors.name.message}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicDescription">
                    <TextField
                      id="outlined-description"
                      label="Description of document upload"
                      variant="outlined"
                      fullWidth
                      className={!errors.description ? classes.root : "w-100"}
                      error={errors.description ? true : false}
                      name="description"
                      multiline
                      rows={2}
                      inputRef={register()}
                      helperText={
                        errors.description && errors.description.message
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicUpload">
                    <DropZone
                      accept={itemDocument.extension.toString()}
                      onDrop={handleDrop}
                      multiple={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "dropZone" })}>
                          <input {...getInputProps()} />
                          <p>
                            Upload document File (You can only able to choose
                            &nbsp;
                            {itemDocument.extension.toString()})
                          </p>
                          <small>Click to select file or Drag and Drop.</small>
                        </div>
                      )}
                    </DropZone>
                  </Form.Group>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;
