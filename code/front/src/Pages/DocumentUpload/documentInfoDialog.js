import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const DocumentInfoDialog = (props) => {
  const { open, item, setOpen } = props;

  const prepareHtml = (description) => {
    if (description) {
      return { __html: description || "" };
    }
    return { __html: "" };
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"sm"}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="alert-dialog-title">{item.title}</DialogTitle>
      <DialogContent>
        <div dangerouslySetInnerHTML={prepareHtml(item.description)}></div>
      </DialogContent>

      <DialogActions className="d-flex justify-content-start mb-4 ml-2">
        <Button variant="contained" onClick={() => setOpen(false)} size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentInfoDialog;
