import React, { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { updateRequestData } from "../../../actions/auditRequestActions";
import { useDispatch } from "react-redux";
import { toUcFirst } from "../../../utils/helpers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #50663c 30%, #50663c 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
  },
  label: {
    textTransform: "capitalize",
  },
});

export default function AlertDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { dialog, setShowDialog } = props;
  const [open, setOpen] = useState(true);

  const handleClose = (action) => {
    if (action) {
      var request = {};
      request.type = dialog.type;
      request.audit_id = dialog._id;
      request.role = 2;
      dispatch(updateRequestData(request));
      setShowDialog(false);
      setOpen(false);
    } else {
      setShowDialog(false);
      setOpen(false);
    }
  };

  return (
    <Fragment>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">{dialog.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.message}
            {dialog.title && (
              <>
                "<b>{toUcFirst(dialog.title)}</b>"
              </>
            )}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose(true)}
            color="primary"
            autoFocus
            variant="contained"
            classes={{
              root: classes.root,
              label: classes.label,
            }}
          >
            Yes
          </Button>
          <Button onClick={() => handleClose(false)} variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
