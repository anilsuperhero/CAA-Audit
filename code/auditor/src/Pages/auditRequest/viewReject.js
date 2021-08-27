import React, { Fragment, useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { getReportReject } from "../../actions/documentAction";
import { useDispatch } from "react-redux";
import { Table } from "react-bootstrap";
import { date } from "../../utils/helpers";

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

const RejectReportDialog = (props) => {
  const { open, setOpen, item } = props;
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const [list, setList] = useState([]);
  useEffect(() => {
    const request = {};
    request.auditId = item._id;
    dispatch(getReportReject(request, setList));
  }, [item._id, dispatch]);
  return (
    <Fragment>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Rejection reasons for ({item.title})
        </DialogTitle>
        <DialogContent>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {list &&
                list.map((itemList, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{date(itemList.created_at)}</td>
                    <td style={{ whiteSpace: "break-spaces" }}>
                      {itemList.report_remarks}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default RejectReportDialog;
