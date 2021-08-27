import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { date } from "../../utils/helpers";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { useHistory } from "react-router-dom";
import ForumIcon from "@material-ui/icons/Forum";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import UploadReportDialog from "./uploadReport";
import ViewReportDialog from "./viewReport";
import ReportRejectDialog from "./viewReject";
import BlockIcon from "@material-ui/icons/Block";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { loadToasterData } from "../../actions/baseActions";
import { useDispatch } from "react-redux";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PeopleIcon from "@material-ui/icons/People";

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
    handleChangeStatus,
    userAuditorInfo,
    downloadPersonnel,
    handleSendReportPeer,
    handleSendReportCompany,
    handleRequestDocument,
  } = props;
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(1);
  const [viewReport, setViewReport] = useState(false);
  const [viewRejectReport, setViewRejectReport] = useState(false);
  const dispatch = useDispatch();

  const handleListItemClick = (value) => {
    if (value === "VIEW") {
      handleViewClick(item);
    }
    if (value === "DOCUMENT") {
      history.push(
        `/audit-request/company-document/${item.company.id}/${item.company.name}/${item._id}`
      );
    }
    if (value === "PROGRESS" || value === "PROGRESS_STAGE") {
      handleChangeStatus(item, value);
    }
    if (value === "REQUEST_DOCUMENT") {
      handleRequestDocument(item, value);
    }
  };

  const handleUploadDocument = (type) => {
    setStage(type);
    setOpen(true);
  };

  const handleViewReport = (type) => {
    setStage(type);
    setViewReport(true);
  };

  const downloadKeyPersonnel = () => {
    downloadPersonnel(item.company.id);
  };

  const sendReportPeer = () => {
    handleSendReportPeer(item);
  };

  const sendReportCompany = () => {
    if (item.status === "REPORT_REVIEW") {
      dispatch(
        loadToasterData({
          open: true,
          message: "This company are not paid final payment.",
          severity: "error",
        })
      );
      return false;
    } else {
      handleSendReportCompany(item);
    }
  };

  const rejectReport = () => {
    setViewRejectReport(true);
  };

  return (
    <>
      <tr className="itemListing">
        <td>
          {item.lead === userAuditorInfo._id && (
            <Fragment>
              {item.status !== "ACCEPT_REPORT" && !item.is_stage ? (
                <Fragment>
                  <Tooltip
                    title="Audit details"
                    arrow
                    placement="top"
                    TransitionComponent={Zoom}
                    onClick={() => handleListItemClick("VIEW")}
                  >
                    <Fab
                      variant="extended"
                      size="small"
                      className={classes.margin}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Fab>
                  </Tooltip>
                  {item.is_start && item.is_request === 1 && (
                    <Tooltip
                      title="Chat"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() =>
                        history.push(
                          "/audit-request/chat/" +
                            item._id +
                            "/" +
                            item.audit_number
                        )
                      }
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <ForumIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.is_start && item.is_request === 1 && (
                    <Tooltip
                      title="View Documents"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() =>
                        history.push(
                          "/audit-request/document-update/" + item._id
                        )
                      }
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <InsertDriveFileIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.is_document && item.required_additional_doc_company && (
                    <Tooltip
                      title="Additional Documents"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleListItemClick("DOCUMENT")}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <FileCopyIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.is_start && !item.required_additional_doc && (
                    <Tooltip
                      title="Request for additional documents"
                      className={`login-btn ${
                        item.status === "PROGRESS" && "green-bg search_button"
                      }`}
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleListItemClick("REQUEST_DOCUMENT")}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <NoteAddIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}

                  {item.status === "AUDIT_DATE_BOOK" && (
                    <Tooltip
                      title={
                        item.type === "Certification"
                          ? "Start audit"
                          : "Start audit"
                      }
                      arrow
                      className={`login-btn ${
                        item.status === "AUDIT_DATE_BOOK" &&
                        "green-bg search_button"
                      }`}
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleListItemClick("PROGRESS")}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {(item.status === "PROGRESS" ||
                    item.status === "REPORT_REJECT") &&
                    item.lead === userAuditorInfo._id && (
                      <Tooltip
                        title="Upload Report"
                        className={`login-btn ${
                          (item.status === "PROGRESS" ||
                            item.status === "REPORT_REJECT") &&
                          "green-bg search_button"
                        }`}
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={() => handleUploadDocument(1)}
                      >
                        <Fab
                          variant="extended"
                          size="small"
                          className={classes.margin}
                        >
                          <PermContactCalendarIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    )}
                  {item.status === "REPORT_REJECT" && (
                    <Tooltip
                      title="Rejection reasons"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={rejectReport}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <BlockIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.status === "REPORT_UPLOAD" && (
                    <Tooltip
                      title={
                        item.type === "Certification"
                          ? "Download Report Stage 1"
                          : "Download Report"
                      }
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleViewReport(1)}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <CloudDownloadIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.type === "Certification" && (
                    <Tooltip
                      title="Download Key Personnel"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={downloadKeyPersonnel}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <PeopleIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <Tooltip
                    title="Audit details"
                    arrow
                    placement="top"
                    TransitionComponent={Zoom}
                    onClick={() => handleListItemClick("VIEW")}
                  >
                    <Fab
                      variant="extended"
                      size="small"
                      className={classes.margin}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Fab>
                  </Tooltip>
                  <Tooltip
                    title={
                      item.type === "Certification"
                        ? "Download Report Stage 1"
                        : "Download Report"
                    }
                    arrow
                    placement="top"
                    TransitionComponent={Zoom}
                    onClick={() => handleViewReport(1)}
                  >
                    <Fab
                      variant="extended"
                      size="small"
                      className={classes.margin}
                    >
                      <CloudDownloadIcon fontSize="small" />
                    </Fab>
                  </Tooltip>

                  {item.type === "Certification" && (
                    <Tooltip
                      title="Download Key Personnel"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={downloadKeyPersonnel}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <PeopleIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}

                  {item.is_stage && item.status === "STAGE_CONFORM" && (
                    <Tooltip
                      title="Start audit"
                      className={`login-btn ${
                        item.status === "STAGE_CONFORM" &&
                        "green-bg search_button"
                      }`}
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleListItemClick("PROGRESS_STAGE")}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {(item.status === "PROGRESS_STAGE" ||
                    item.status === "REPORT_REJECT_STAGE") && (
                    <Tooltip
                      title="Upload Report 2 Stage"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleUploadDocument(2)}
                      className={`login-btn ${
                        (item.status === "PROGRESS_STAGE" ||
                          item.status === "REPORT_REJECT_STAGE") &&
                        "green-bg search_button"
                      }`}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <PermContactCalendarIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.is_stage && item.status === "REPORT_UPLOAD_STAGE" && (
                    <Tooltip
                      title="Send report to Peer Auditor"
                      arrow
                      placement="top"
                      className={`login-btn ${
                        item.status === "REPORT_UPLOAD_STAGE" &&
                        "green-bg search_button"
                      }`}
                      TransitionComponent={Zoom}
                      onClick={sendReportPeer}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.is_stage &&
                    (item.status === "SEND_PEER" ||
                      item.status === "REPORT_REVIEW" ||
                      item.status === "SEND_REPORT_COMPANY" ||
                      item.status === "ACCEPT_REPORT") && (
                      <Tooltip
                        title="Download Report Stage 2"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={() => handleViewReport(2)}
                      >
                        <Fab
                          variant="extended"
                          size="small"
                          className={classes.margin}
                        >
                          <CloudDownloadIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    )}
                  {item.is_stage &&
                    (item.status === "REPORT_REVIEW" ||
                      item.status === "INVOICE_PAID_STAGE") && (
                      <Tooltip
                        title="Send report to Company"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={sendReportCompany}
                        className={`login-btn ${
                          (item.status === "REPORT_REVIEW" ||
                            item.status === "INVOICE_PAID_STAGE") &&
                          "green-bg search_button"
                        }`}
                      >
                        <Fab
                          variant="extended"
                          size="small"
                          className={classes.margin}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    )}
                </Fragment>
              )}
            </Fragment>
          )}
          {item.peer === userAuditorInfo._id && (
            <Fragment>
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
              {item.report_stage && (
                <Tooltip
                  title="Download Report"
                  arrow
                  placement="top"
                  TransitionComponent={Zoom}
                  onClick={() => handleViewReport(2)}
                >
                  <Fab
                    variant="extended"
                    size="small"
                    className={classes.margin}
                  >
                    <CloudDownloadIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              )}

              {item.status === "SEND_PEER" && (
                <Tooltip
                  title="Upload Report"
                  arrow
                  placement="top"
                  className={`login-btn ${
                    item.status === "SEND_PEER" && "green-bg search_button"
                  }`}
                  TransitionComponent={Zoom}
                  onClick={() => handleUploadDocument(3)}
                >
                  <Fab
                    variant="extended"
                    size="small"
                    className={classes.margin}
                  >
                    <PermContactCalendarIcon fontSize="small" />
                  </Fab>
                </Tooltip>
              )}
            </Fragment>
          )}
        </td>
        <td>{item.company.name}</td>
        <td>{item.type}</td>
        <td>
          {item.status_view} {item.status}
        </td>
        <td>{date(item.created_at)}</td>
        <td>{date(item.updated_at)}</td>
      </tr>
      {open && (
        <UploadReportDialog
          open={open}
          setOpen={setOpen}
          item={item}
          stage={stage}
        />
      )}
      {viewReport && (
        <ViewReportDialog
          open={viewReport}
          setOpen={setViewReport}
          item={item}
          stage={stage}
        />
      )}
      {viewRejectReport && (
        <ReportRejectDialog
          open={viewRejectReport}
          setOpen={setViewRejectReport}
          item={item}
        />
      )}
    </>
  );
};

export default List;
