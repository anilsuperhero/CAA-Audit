import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Form, Row, Col } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getDocumentData } from "../../../../actions/documentAction";

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

const FormDialog = (props) => {
  const { open, setOpen, itemDocument, registrationId } = props;
  const dispatch = useDispatch();
  let { slug } = useParams();

  const [documentData, getDocument] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const request = {};
      request.auditId = slug;
      request.documentId = itemDocument.id;
      request.registration_id = registrationId;
      request.type = "SINGLE";
      dispatch(getDocumentData(request, getDocument));
    };
    if (itemDocument.status === 6 || itemDocument.status === 2) fetchData();
  }, [dispatch, itemDocument, slug, registrationId]);

  return (
    <div>
      <Dialog fullWidth={true} onClose={() => setOpen(false)} open={open}>
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {itemDocument.title}
          <FormHelperText></FormHelperText>
        </DialogTitle>
        <DialogContent dividers>
          <Form autoComplete="off">
            <Row className="justify-content-center mx-auto">
              <Col md={12} lg={12}>
                {documentData.document_name && (
                  <Form.Group controlId="formBasicRemarks">
                    <TextField
                      autoFocus={true}
                      InputProps={{ readOnly: true }}
                      defaultValue={documentData.document_name}
                      id="outlined-name"
                      label="Name of document"
                      variant="outlined"
                      fullWidth
                      name="name"
                    />
                  </Form.Group>
                )}
                {documentData.description && (
                  <Form.Group controlId="formBasicDescription">
                    <TextField
                      id="outlined-description"
                      label="Description of document upload"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      fullWidth
                      defaultValue={documentData.description}
                      name="description"
                      multiline
                      rows={2}
                    />
                  </Form.Group>
                )}
                {documentData.remarks && (
                  <Form.Group controlId="formBasicRemarks">
                    <TextField
                      id="outlined-remarks"
                      label="Remarks"
                      InputProps={{ readOnly: true }}
                      defaultValue={documentData.remarks}
                      variant="outlined"
                      fullWidth
                      name="remarks"
                      multiline
                      rows={2}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;
