import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const DocumentInfoDialog = (props) => {
  const { open } = props;
  const history = useHistory();
  const { setting } = useSelector((state) => ({
    setting: state.setting,
  }));

  const closeClick = () => {
    history.push("/audit-request");
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth={"sm"}>
      <DialogTitle id="alert-dialog-title">
        <WarningIcon />
        &nbsp;
        {"Alert"}
      </DialogTitle>
      <DialogContent>
        <div className="white-space">{setting.audit_conformation}</div>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={() => closeClick()} size="large">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentInfoDialog;
