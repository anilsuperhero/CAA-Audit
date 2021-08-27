import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import { loadDialogData } from "../../actions/baseActions";
import { toUcFirst } from "../../utils/helpers";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialog(props) {
  const dispatch = useDispatch();
  const { dialog } = props;
  const { dialogOpen } = useSelector((state) => ({
    dialogOpen: state.dialogOpen,
  }));

  const handleClose = (action) => {
    dispatch(loadDialogData(false));
    if (action) {
      dialog.action = true;
      props.handleDeleteClick(dialog);
    } else {
      dialog.action = false;
      props.handleDeleteClick(dialog);
    }
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        fullWidth={true}
        TransitionComponent={Transition}
        maxWidth={"xs"}
        keepMounted
      >
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
        <DialogActions className="d-flex justify-content-start ml-3 mb-3 pt-0">
          <Button
            size="large"
            onClick={() => handleClose(true)}
            color="primary"
            autoFocus
            variant="contained"
            className="login-btn green-bg"
          >
            {"Yes"}
          </Button>
          <Button
            onClick={() => handleClose(false)}
            variant="contained"
            size="large"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
