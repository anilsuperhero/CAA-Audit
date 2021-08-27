import React, { Fragment, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import FormDialog from "./primaryDocumentForm";
import { getDocumentData } from "../../actions/documentAction";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { downloadFile } from "../../utils/helpers";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#50663c",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    width: "Calc(100% - 30px)",
    margin: "0 15px",
  },
});

const List = (props) => {
  const { document, keyPerson } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [itemDocument, setItemDocument] = useState({});
  let { slug } = useParams();
  const dispatch = useDispatch();

  const handleDocumentUpload = (item) => {
    setItemDocument(item);
    setOpen(true);
  };
  const handleDocumentDownload = (item) => {
    const request = {};
    request.auditId = slug;
    request.documentId = item.documentId;
    request.userId = item._id;
    request.type = "PRIMARY";
    dispatch(getDocumentData(request, getDocument));
  };

  const getDocument = (item) => {
    downloadFile(item.documentUrl, item.document_image_name);
  };

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table striped responsive>
          <TableHead>
            <TableRow>
              <StyledTableCell>Staff</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keyPerson.map((item, key) => (
              <StyledTableRow
                key={key}
                className={
                  item.status === 1 || item.status === 4 ? "pending" : ""
                }
              >
                <StyledTableCell>
                  <b>{item.first_name + " " + item.last_name}</b>
                  <div>{item.email}</div>
                  <div>{item.positionHeld}</div>
                </StyledTableCell>
                {item.status === 1 && (
                  <StyledTableCell>
                    <span className="pendingStatus">Pending</span>
                  </StyledTableCell>
                )}
                {item.status === 2 && (
                  <StyledTableCell>
                    <span className="submittedStatus">Submitted</span>
                  </StyledTableCell>
                )}
                {item.status === 6 && (
                  <StyledTableCell>
                    <span className="progressStatus">Not Applicable</span>
                  </StyledTableCell>
                )}
                {item.status === 4 && (
                  <StyledTableCell>
                    <span className="progressStatus">InProgress</span>
                  </StyledTableCell>
                )}
                <StyledTableCell>
                  <Tooltip
                    title="View Document"
                    arrow
                    placement="top"
                    TransitionComponent={Zoom}
                    onClick={() => handleDocumentUpload(item)}
                  >
                    <Fab variant="extended" size="small" className="mr-3">
                      <VisibilityIcon fontSize="small" />
                    </Fab>
                  </Tooltip>

                  {item.status === 2 && (
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleDocumentDownload(item)}
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
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {open && (
        <FormDialog
          open={open}
          setOpen={setOpen}
          itemDocument={itemDocument}
          documents={document}
        />
      )}
    </Fragment>
  );
};

export default List;
