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
import { loadToasterData } from "../../../../actions/baseActions";
import DropZone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { attech, PLUS } from "../../../../assets/img";
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
  const {
    open,
    setOpen,
    itemDocument,
    registrationId,
    setSelectedDocument,
    staffId,
  } = props;
  const { register, errors, handleSubmit, getValues } = useForm();
  const dispatch = useDispatch();
  let { slug } = useParams();
  const [selectedFile, setSelectedFile] = useState([]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      dispatch(
        loadToasterData({
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
    formData.append("audit_id", slug);
    formData.append("document_id", itemDocument.id);
    formData.append("registration_id", registrationId);
    formData.append("staff_id", staffId);
    formData.append("document_name", getValues("name"));
    formData.append("document", selectedFile[0]);
    formData.append("status", 1);
    formData.append("type", "STAFF-MULTI");
    formData.append("description", getValues("description"));
    dispatch(singleDocument(formData, loadDocument, "STAFF-MULTI"));
  };

  const loadDocument = () => {
    const request = {};
    request.audit_id = slug;
    request.registration_id = registrationId;
    request.staff_id = staffId;
    request.document_id = itemDocument.id;
    request.type = "STAFF-MULTI";
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
                      multiline={true}
                      rows={4}
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
                            Upload file (you can only choose the following
                            &nbsp;
                            {itemDocument.extension.toString()})
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
                          <div className="file_name">
                            {selectedFile[0].name}
                          </div>
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Control type="hidden" name="_id" ref={register({})} />
              <Row className="mt-2">
                <Col md={2} sm={2} lg={3} className="ml-3">
                  <SubmitButton title={"Save"} />
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
