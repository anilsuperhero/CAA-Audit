import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DocumentList from "./list";
import { useParams } from "react-router-dom";
import { getMultiDocument } from "../../../actions/documentAction";
import { useDispatch } from "react-redux";

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
  const { open, setOpen, itemDocument, documents } = props;
  let { slug } = useParams();
  const [selectedDocument, setSelectedDocument] = useState([]);

  const loadDocument = (data) => {
    setSelectedDocument(data);
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
    if (itemDocument.status === 4 || itemDocument.status === 2) fetchData();
  }, [dispatch, itemDocument, slug]);

  return (
    <div>
      <Dialog
        fullWidth={true}
        onClose={() => setOpen(false)}
        open={open}
        maxWidth={"md"}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {itemDocument.first_name}&nbsp;{itemDocument.last_name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocument.length > 0 && (
            <DocumentList
              selectedDocument={selectedDocument}
              itemDocument={itemDocument}
              documents={documents}
              setSelectedDocument={loadDocument}
              isUpdate={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;
