import React, { useState, Fragment } from "react";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { date, downloadFile } from "../../utils/helpers";
import VisibilitySharpIcon from "@material-ui/icons/VisibilitySharp";
import PeopleIcon from "@material-ui/icons/People";
import DescriptionIcon from "@material-ui/icons/Description";
import { useHistory } from "react-router-dom";
import ViewReportDialog from "./report/viewReport";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ChangeStatus from "./report/updateReport";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PermMediaIcon from "@material-ui/icons/PermMedia";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  root: {
    background: "linear-gradient(45deg, #50663c 30%, #50663c 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
  },
}));

const List = (props) => {
  const history = useHistory();
  const { item } = props;
  const classes = useStyles();
  const [viewReport, setViewReport] = useState(false);
  const [stage, setStage] = useState(1);
  const [dialog, setDialog] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const handleViewClick = (type) => {
    item.step = type;
    props.handleViewclick(item);
  };

  const handleAssignClick = () => {
    props.handleAssignClick(item);
  };

  const handleViewDocumentClick = () => {
    history.push("/audit-request/document/" + item._id);
  };

  const handleOtherDocumentClick = () => {
    history.push(
      `/audit-request/company-document/${item.company.id}/${item.company.name}/${item._id}`
    );
  };

  const handleViewReport = (type) => {
    setStage(type);
    setViewReport(true);
  };

  const handleStatusUpdate = (type) => {
    var data = {};
    data.audit_id = item._id;
    data._id = item._id;
    data.type = item.type;
    data.role = 1;
    data.type = type;
    data.message = `Confirm you have sent the report to NDIA for the ${item.type} audit ref (quote) #${item.title}`;
    data.dialogTitle = "Send report to NDIA";
    data.open = true;
    setShowDialog(true);
    setDialog(data);
  };

  return (
    <Fragment>
      <tr key={item._id} className="itemListing">
        <th scope="row">{item.company.name}</th>
        <td>{item.title}</td>
        <td>{item.type}</td>
        <td>{item.status_view}</td>
        <td>
          {item.leadAuditor.first_name ? (
            <span>
              {item.leadAuditor.first_name}&nbsp;
              {item.leadAuditor.last_name}
            </span>
          ) : (
            "--"
          )}
        </td>
        <td>{date(item.updated_at)}</td>
        {item.status !== "ACCEPT_REPORT" &&
        item.status !== "COMPLETED" &&
        item.status !== "AU_GOVERNMENT" ? (
          <td>
            <Tooltip
              title="View"
              arrow
              placement="top"
              TransitionComponent={Zoom}
              onClick={() => handleViewClick("VIEW")}
            >
              <Fab variant="extended" size="small" className={classes.margin}>
                <VisibilitySharpIcon fontSize="small" />
              </Fab>
            </Tooltip>
            {item.is_request === 1 && (
              <Tooltip
                title="Assign Auditor"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleAssignClick()}
              >
                <Fab
                  variant="extended"
                  size="small"
                  classes={{
                    root: classes.root,
                  }}
                  className={classes.margin}
                >
                  <PeopleIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {item.is_request === 1 && (
              <Tooltip
                title="View Documents"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleViewDocumentClick()}
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <PermMediaIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {item.is_document && (
              <Tooltip
                title="Additional documents"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleOtherDocumentClick()}
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <FileCopyIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.sign_type === "Self" && (
              <Tooltip
                title="Download Signed Agreement"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() =>
                  downloadFile(
                    item.sla_document_sign,
                    item.sla_document_sign_name
                  )
                }
              >
                <Fab variant="extended" size="small" className={classes.margin}>
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
              onClick={() => handleViewClick("VIEW")}
            >
              <Fab variant="extended" size="small" className={classes.margin}>
                <VisibilitySharpIcon fontSize="small" />
              </Fab>
            </Tooltip>

            <Tooltip
              title={
                item.type === "Certification"
                  ? "Download Report 1 stage"
                  : "Download Report"
              }
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
                <DescriptionIcon fontSize="small" />
              </Fab>
            </Tooltip>
            {item.is_stage && (
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
                  <DescriptionIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}

            {item.status === "ACCEPT_REPORT" && (
              <Tooltip
                title="Submit report to NDIA"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleStatusUpdate("AU_GOVERNMENT", item)}
              >
                <Fab
                  variant="extended"
                  size="small"
                  classes={{
                    root: classes.root,
                  }}
                  className={classes.margin}
                >
                  <CheckCircleIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {item.is_request === 1 && (
              <Tooltip
                title="View Documents"
                arrow
                placement="top"
                TransitionComponent={Zoom}
                onClick={() => handleViewDocumentClick()}
              >
                <Fab variant="extended" size="small" className={classes.margin}>
                  <PermMediaIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
          </td>
        )}
      </tr>
      {viewReport && (
        <ViewReportDialog
          open={viewReport}
          setOpen={setViewReport}
          item={item}
          stage={stage}
        />
      )}
      {showDialog && (
        <ChangeStatus dialog={dialog} setShowDialog={setShowDialog} />
      )}
    </Fragment>
  );
};

export default List;
