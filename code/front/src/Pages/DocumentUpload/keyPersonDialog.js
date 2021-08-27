import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import { addKeyStaffRequest } from "../../actions/documentAction";
import { loadAuditRequest } from "../../actions/documentAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const PersonDialog = (props) => {
  const { open, keyPerson, slug, setOpen } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = (type) => {
    if (type === "NEW" || type === "CANCEL") {
      history.push("/user/key-person");
    }
    if (type === "AGREE") {
      setOpen(false);
      dispatch(addKeyStaffRequest({ slug: slug }, pageReload));
    }
  };

  const pageReload = () => {
    dispatch(loadAuditRequest({ slug: slug }));
    window.location.reload();
  };

  const { setting } = useSelector((state) => ({
    setting: state.setting,
  }));

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <WarningIcon />
        &nbsp;
        {"Alert"}
      </DialogTitle>
      <DialogContent>
        {keyPerson.length === 0 ? (
          <DialogContentText id="alert-dialog-description">
            You have not added any Key Personnel yet. Before uploading documents
            you need to add key personnel first.
          </DialogContentText>
        ) : (
          <DialogContentText id="alert-dialog-description">
            {setting.key_personnel}
          </DialogContentText>
        )}
      </DialogContent>
      {keyPerson.length > 0 ? (
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => handleClick("AGREE")}
            size="large"
          >
            I Agree
          </Button>
          <Button
            size="large"
            variant="contained"
            className="login-btn green-bg search_button"
            onClick={() => handleClick("CANCEL")}
          >
            Add New
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            size="large"
            variant="contained"
            className="login-btn green-bg search_button"
            onClick={() => handleClick("NEW")}
          >
            Add New
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PersonDialog;
