import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CurrencyFormat from "react-currency-format";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import InsertDriveFileRoundedIcon from "@material-ui/icons/InsertDriveFileRounded";
import { downloadFile } from "../../utils/helpers";
import { makeStyles } from "@material-ui/core/styles";
import PDFView from "./pdfViewer";
const { REACT_APP_CURRENCY } = process.env;

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

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function View(props) {
  const handleClose = () => {
    props.handleClose({});
  };

  const { open, keyItem, handleAgreementClick } = props;
  const [item] = useState(keyItem);
  const classes = useStyles();
  const [pdfUrl, setPdfUrl] = useState();
  const [viewPdf, setPdfViewer] = useState(false);

  const [pdfTitle, setTitle] = useState("");

  const slaViewUpload = (action) => {
    if (action) {
      setPdfUrl(item.sla_document);
    }
    setPdfViewer(action);
  };

  const downloadDocument = (type) => {
    if (type === "SLA") {
      downloadFile(item.sla_document, item.sla_document_name);
    } else {
      downloadFile(item.invoice_document, item.invoice_document_name);
    }
  };

  const viewPdfFile = (type) => {
    var url = "";
    if (type === "SLA") {
      url = item.sla_document;
      setTitle("Agreement Document");
    } else {
      setTitle("INVOICE");
      url = item.invoice_document;
    }
    setPdfViewer(true);
    setPdfUrl(url);
  };

  const handleActionClick = (type) => {
    handleAgreementClick(type, item);
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
          Agreement & Invoice ({item.title})
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <div className="file-outer">
                {/* <img src={PDF} alt="pdf_file" />
                <span>{item.sla_document_name}</span> */}
                <div className="amount">
                  <h5>Amount</h5>
                  <span className="amount-value">
                    <CurrencyFormat
                      value={item.amount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={REACT_APP_CURRENCY}
                    />
                  </span>
                </div>
                {item.type === "Certification" && (
                  <div className="remark-advance">
                    <div className="remark">
                      <strong>Deposit (Payable Now)</strong>
                      <CurrencyFormat
                        value={item.advance_payment}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={REACT_APP_CURRENCY}
                      />
                    </div>

                    <div className="advance">
                      <strong>Final Payment</strong>
                      <CurrencyFormat
                        value={item.final_payment}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={REACT_APP_CURRENCY}
                      />
                    </div>
                  </div>
                )}

                <div className="remarkonly white-space">
                  <strong>Remarks</strong>
                  {item.remarks ? item.remarks : "N/A"}
                </div>
              </div>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Button
                      size="large"
                      variant="contained"
                      color="default"
                      fullWidth
                      style={{ textAlign: "left" }}
                      className={classes.button}
                      startIcon={<VisibilityIcon />}
                      onClick={() => viewPdfFile("SLA")}
                    >
                      View Agreement
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      fullWidth
                      onClick={() => downloadDocument("SLA")}
                      color="default"
                      className={classes.button}
                      startIcon={<CloudDownloadIcon />}
                    >
                      Download Agreement
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="default"
                      fullWidth
                      className={classes.button}
                      startIcon={<VisibilityIcon />}
                      onClick={() => viewPdfFile("INVOICE")}
                    >
                      View Invoice
                    </Button>
                    <Button
                    size="large"
                      fullWidth
                      variant="contained"
                      onClick={() => downloadDocument("INVOICE")}
                      color="default"
                      className={classes.button}
                      startIcon={<CloudDownloadIcon />}
                    >
                      Download Invoice
                    </Button>
                  </Grid>
                  {item.status === "CREATED" && (
                    <Grid item xs={12}>
                      <Button
                      size="large"
                        fullWidth
                        variant="contained"
                        onClick={() => handleActionClick("AGREEMENT")}
                        color="secondary"
                        className={"green-bg search_button"}
                        startIcon={<InsertDriveFileRoundedIcon />}
                      >
                        Sign agreement
                      </Button>
                    </Grid>
                  )}
                  {(item.status === "SLASIGNED" ||
                    item.status === "REPORT_REVIEW") && (
                    <Grid item xs={12}>
                      <Button
                      size="large"
                        fullWidth
                        variant="contained"
                        onClick={() => handleActionClick("PAY_INVOICE")}
                        color="secondary"
                        className={"green-bg search_button"}
                        startIcon={<InsertDriveFileRoundedIcon />}
                      >
                        Pay Invoice
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {viewPdf && (
        <PDFView
          open={viewPdf}
          handleClose={slaViewUpload}
          detail={pdfUrl}
          title={pdfTitle}
        />
      )}
    </div>
  );
}
