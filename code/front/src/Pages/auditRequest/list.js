import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { date } from "../../utils/helpers";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import { useHistory } from "react-router-dom";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ViewReportDialog from "./report/viewReport";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import RejectReportDialog from "./report/rejectReport";
import RejectReportStageDialog from "./report/rejectReportStage";
import RequestStage from "./request/requestDialog";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const List = (props) => {
  const {
    item,
    handleViewClick,
    handleSlaView,
    handlePaymentClick,
    handleAcceptClick,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const [viewReport, setViewReport] = useState(false);
  const [stage, setStage] = useState(1);
  const [viewRequestStage, setRequestStage] = useState(false);
  const [rejectReport, setRejectReport] = useState(false);
  const [rejectReportStage, setRejectReportStage] = useState(false);
  const handleListItemClick = (value) => {
    if (value === "VIEW") {
      handleViewClick(item);
    }
    if (value === "SLAUPLOAD") {
      handleSlaView(item);
    }
    if (value === "PAYMENT") {
      handlePaymentClick(item);
    }
  };
  const handleViewReport = (type) => {
    setStage(type);
    setViewReport(true);
  };

  const handleRequestStage = () => {
    setRequestStage(true);
  };

  const handleRejectReport = () => {
    setRejectReport(true);
  };

  const handleRejectReportStage = () => {
    setRejectReportStage(true);
  };

  return (
    <Fragment>
      <tr className="itemListing">
        {item.status !== "ACCEPT_REPORT" &&
        item.status !== "REQUEST_STAGE" &&
        item.status !== "REPORT_REJECT_STAGE" ? (
          <td>
            <Tooltip
              title="Audit details"
              arrow
              placement="top"
              TransitionComponent={Zoom}
              onClick={() => handleListItemClick("VIEW")}
            >
              <Fab variant="extended" size="small" className={classes.margin}>
                <VisibilityIcon fontSize="small" />
              </Fab>
            </Tooltip>
            {item.sla_document && (
              <Tooltip
                title="View Agreement and Invoice"
                className={`login-btn ${
                  item.status === "CREATED" && "green-bg search_button"
                }`}
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleListItemClick("SLAUPLOAD")}
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <DescriptionIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.status === "SLASIGNED" &&
              item.type === "Verification" &&
              item.is_advance === false &&
              item.is_final === false && (
                <Tooltip
                  title="Payment"
                  arrow
                  placement="top"
                  className={`login-btn ${
                    item.status === "SLASIGNED" && "green-bg search_button"
                  }`}
                  TransitionComponent={Zoom}
                  onClick={() => handleListItemClick("PAYMENT")}
                >
                  <Fab
                    variant="extended"
                    size="small"
                    color="inherit"
                    className={classes.margin}
                  >
                    <MonetizationOnIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
            {item.status === "SLASIGNED" &&
              item.type === "Certification" &&
              item.is_advance === false && (
                <Tooltip
                  title="Payment"
                  className={`login-btn ${
                    item.status === "SLASIGNED" && "green-bg search_button"
                  }`}
                  arrow
                  placement="top"
                  TransitionComponent={Zoom}
                  onClick={() => handleListItemClick("PAYMENT")}
                >
                  <Fab
                    variant="extended"
                    size="small"
                    color="inherit"
                    className={classes.margin}
                  >
                    <MonetizationOnIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
            {item.status === "REPORT_UPLOAD_STAGE" && (
              <Tooltip
                title="Payment"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleListItemClick("PAYMENT")}
              >
                <Fab
                  variant="extended"
                  size="small"
                  color="inherit"
                  className={classes.margin}
                >
                  <MonetizationOnIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.is_advance && (
              <Tooltip
                title={
                  item.is_request === 0 ? "Upload Documents" : "View Documents"
                }
                arrow
                className={`login-btn ${
                  item.status === "KEP_UPDATE" && "green-bg search_button"
                }`}
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => history.push("/document-update/" + item._id)}
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  {item.is_request === 0 ? (
                    <NoteAddIcon fontSize="small" />
                  ) : (
                    <PermMediaIcon fontSize="small" />
                  )}
                </Fab>
              </Tooltip>
            )}
            {item.lead && item.status !== "AU_GOVERNMENT" && (
              <Tooltip
                title="Chat"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                className={`login-btn ${
                  item.status === "PROGRESS" && "green-bg search_button"
                }`}
                onClick={() =>
                  history.push("/chat/" + item._id + "/" + item.title)
                }
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <ChatBubbleIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {item.required_additional_doc && item.status !== "AU_GOVERNMENT" && (
              <Tooltip
                title="Add additional documents"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                className={`login-btn ${
                  item.status === "PROGRESS" && "green-bg search_button"
                }`}
                onClick={() =>
                  history.push("/additional/documents/" + item._id)
                }
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <FileCopyIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {(item.status === "REPORT_UPLOAD" ||
              item.status === "SEND_REPORT_COMPANY") && (
              <Tooltip
                title="Download Report"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                className={`login-btn ${
                  item.status === "REPORT_UPLOAD" && "green-bg search_button"
                }`}
              >
                <Fab
                  variant="extended"
                  size="small"
                  className={classes.margin}
                  onClick={() => handleViewReport(1)}
                >
                  <CloudDownloadIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.status === "SEND_REPORT_COMPANY" && (
              <Tooltip
                title="Download Report 2 stage"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                className={`login-btn ${
                  item.status === "SEND_REPORT_COMPANY" &&
                  "green-bg search_button"
                }`}
              >
                <Fab
                  variant="extended"
                  size="small"
                  className={classes.margin}
                  onClick={() => handleViewReport(2)}
                >
                  <CloudDownloadIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
          </td>
        ) : (
          <td>
            <Tooltip
              title="Audit details"
              arrow
              placement="top"
              TransitionComponent={Zoom}
              onClick={() => handleListItemClick("VIEW")}
            >
              <Fab variant="extended" size="small" className={classes.margin}>
                <VisibilityIcon fontSize="small" />
              </Fab>
            </Tooltip>

            <Tooltip
              title="Download Report"
              arrow
              placement="top"
              TransitionComponent={Zoom}
            >
              <Fab
                variant="extended"
                size="small"
                className={classes.margin}
                onClick={() => handleViewReport(1)}
              >
                <CloudDownloadIcon fontSize="small" />
              </Fab>
            </Tooltip>
            {item.is_stage && item.status === "ACCEPT_REPORT" && (
              <Tooltip
                title="Download Report 2 stage"
                arrow
                placement="top"
                TransitionComponent={Zoom}
              >
                <Fab
                  variant="extended"
                  size="small"
                  className={classes.margin}
                  onClick={() => handleViewReport(2)}
                >
                  <CloudDownloadIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.type === "Certification" &&
              item.status === "ACCEPT_REPORT" &&
              !item.is_stage && (
                <Tooltip
                  title="Request for 2 Stage"
                  arrow
                  placement="top"
                  className={`login-btn ${
                    item.status === "ACCEPT_REPORT" && "green-bg search_button"
                  }`}
                  TransitionComponent={Zoom}
                >
                  <Fab
                    variant="extended"
                    size="small"
                    className={classes.margin}
                    onClick={handleRequestStage}
                  >
                    <DescriptionIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
          </td>
        )}
        <td>{item.title}</td>
        <td>{item.type}</td>
        <td>
          {item.status_view}--- {item.status}
        </td>
        <td>{date(item.created_at)}</td>
        <td>{date(item.updated_at)}</td>
      </tr>
      {viewReport && (
        <ViewReportDialog
          open={viewReport}
          setOpen={setViewReport}
          handleRejectReport={handleRejectReport}
          handleAcceptClick={handleAcceptClick}
          handleRejectReportStage={handleRejectReportStage}
          item={item}
          stage={stage}
        />
      )}
      {rejectReport && (
        <RejectReportDialog
          open={rejectReport}
          setViewReport={setViewReport}
          setOpen={setRejectReport}
          item={item}
        />
      )}
      {viewRequestStage && (
        <RequestStage
          open={viewRequestStage}
          setOpen={setRequestStage}
          item={item}
        />
      )}
      {rejectReportStage && (
        <RejectReportStageDialog
          open={rejectReportStage}
          setOpen={setRejectReportStage}
          setViewReport={setViewReport}
          item={item}
        />
      )}
    </Fragment>
  );
};

export default List;
