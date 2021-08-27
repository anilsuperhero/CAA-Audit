import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DOCUMENT, PLUS } from "../../assets/img/index";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme, downloadFile } from "../../utils/helpers";
import { useForm } from "react-hook-form";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import SubmitButton from "../../Component/Button";
import { useDispatch } from "react-redux";
import FormHelperText from "@material-ui/core/FormHelperText";
import DropZone from "react-dropzone";
import { loadToasterData } from "../../actions/baseActions";
import { createDocument, updateData } from "../../actions/otherDocumentAction";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useParams } from "react-router-dom";

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

export default function CustomizedDialogs(props) {
  const handleClose = () => {
    props.handleClose();
  };
  const { open, keyItem } = props;
  let { slug } = useParams();
  const [selectedFile, setSelectedFile] = useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm({
    defaultValues: keyItem,
  });
  const [item] = useState(keyItem);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      dispatch(
        loadToasterData({
          open: true,
          message: "Please select valid file.",
          severity: "error",
        })
      );
    }
    setSelectedFile(acceptedFiles);
  };

  const removeImage = () => {
    setSelectedFile([]);
  };

  const onSubmit = (data) => {
    if (data._id) {
    } else {
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
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("id", data._id);
    formData.append("image", selectedFile[0]);
    formData.append("description", data.description);
    formData.append("audit_id", slug);
    if (data._id) {
      dispatch(updateData(formData, handleClose, slug));
    } else {
      dispatch(createDocument(formData, handleClose, slug));
    }
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {item._id ? "Update Document" : "Create New Document"}
          &nbsp;
          <FormHelperText error={true}>
            Fields marked with * are mandatory.
          </FormHelperText>
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
                  <Form.Group controlId="formBasicTitle">
                    <TextField
                      required
                      autoFocus={true}
                      id="outlined-title"
                      label="Title"
                      variant="outlined"
                      fullWidth
                      className={!errors.title ? classes.root : "w-100"}
                      error={errors.title ? true : false}
                      name="title"
                      inputRef={register({
                        required: "Please enter title.",
                        minLength: {
                          value: 1,
                          message:
                            "Title should contain at least 1 characters.",
                        },
                        maxLength: {
                          value: 150,
                          message: "Title should not exceed 150 characters.",
                        },
                      })}
                      helperText={errors.title && errors.title.message}
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
                      multiple={false}
                      onDrop={handleDrop}
                      accept=".xlsx,.xls,.jpg,.jpeg,.png,.doc, .docx, .pdf"
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
                              src={DOCUMENT}
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
                    {selectedFile.length === 0 && item.image && (
                      <div className="Uploaded-image">
                        <div className="image_file_name">
                          <div className="file_name">
                            <Button
                              size="large"
                              fullWidth
                              variant="contained"
                              className={classes.button}
                              onClick={() =>
                                downloadFile(item.image, item.document_name)
                              }
                              startIcon={<CloudDownloadIcon />}
                            >
                              Download Document
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Control type="hidden" name="_id" ref={register({})} />
              <Row className="mt-5">
                <Col md={2} sm={2} lg={3} className="ml-3 mb-3">
                  <SubmitButton title={item._id ? "Update" : "Submit"} />
                </Col>
              </Row>
            </Form>
          </MuiThemeProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
