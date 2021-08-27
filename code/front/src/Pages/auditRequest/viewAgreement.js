import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ViewSignature from "./viewSignature";
import { showLoader } from "../../actions/baseActions";
const { REACT_APP_DOCUSING } = process.env;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
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

export default function View(props) {
  const handleClose = () => {
    props.handleClose(false);
  };
  const dispatch = useDispatch();

  const { open, keyItem, agreementActionClick } = props;
  const [item] = useState(keyItem);
  const [viewSignature, setSignature] = useState(false);
  const { setting } = useSelector((state) => ({
    setting: state.setting,
  }));
  const user = useSelector((state) => state.userInfo);
  const prepareHtml = (description) => {
    if (description) {
      return { __html: description || "" };
    }
    return { __html: "" };
  };

  const signature = (action) => {
    setSignature(action);
  };

  const handlePaymentClick = () => {
    item.paymentView = true;
    agreementActionClick(item);
  };

  const signatureDocusign = () => {
    const url =
      REACT_APP_DOCUSING +
      "name=" +
      user.first_name +
      " " +
      user.last_name +
      "&email=" +
      user.email +
      "&id=" +
      item.audit_number +
      "&file=" +
      item.sla_document_old;
    handleClose();
    dispatch(showLoader());
    window.location.href = url;
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Sign agreement for Ref (Quote) #{item.title}
        </DialogTitle>
        <DialogContent dividers>
          <div className="file-outer">
            <div className="agreement_nots">
              <strong>Signature by self:</strong>
              <div
                dangerouslySetInnerHTML={prepareHtml(setting.signature_self)}
              ></div>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => signature(true)}
                    className={"green-bg search_button"}
                  >
                    Download and sign in hard copy
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="file-outer">
            <div className="agreement_nots">
              <strong>Signature by docusign:</strong>
              <div
                dangerouslySetInnerHTML={prepareHtml(setting.signature_online)}
              ></div>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => signatureDocusign(true)}
                    className={"green-bg search_button"}
                  >
                    Sign online digitally
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {viewSignature && (
        <ViewSignature
          open={viewSignature}
          handleClose={signature}
          handleSlaClose={handlePaymentClick}
          detail={item}
        />
      )}
    </div>
  );
}
