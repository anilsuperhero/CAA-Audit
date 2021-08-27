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
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import SingleDocumentDialog from "./documentForm";
import { useParams } from "react-router-dom";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useDispatch } from "react-redux";
import { getDocumentData } from "../../../../actions/documentAction";
import { downloadFile } from "../../../../utils/helpers";
import MultiDocumentDialog from "./multiDocumentForm";

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
  const { documents, groupName, registrationId } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [applicable, setApplicable] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);
  const [isDownload, setDownload] = useState(false);
  const [itemDocument, setItemDocument] = useState({});
  const dispatch = useDispatch();
  const { slug } = useParams();

  const handleDocumentUpload = (item) => {
    setItemDocument(item);
    if (item.documentType === "Single") {
      setOpen(true);
    } else {
      setMultiOpen(true);
    }
  };

  const handleDocumentDownload = (item) => {
    const request = {};
    request.auditId = slug;
    request.documentId = item.id;
    request.registration_id = registrationId;
    request.type = "SINGLE";
    dispatch(getDocumentData(request, getDocument));
  };

  const getDocument = (item) => {
    downloadFile(item.documentUrl, item.document_image_name);
  };

  const handleDocumentMultiple = (item) => {
    setDownload(true);
    setItemDocument(item);
    setMultiOpen(true);
  };

  const handleApplicableDocumentMultiple = (item) => {
    setDownload(true);
    setItemDocument(item);
    setMultiOpen(true);
    setApplicable(true);
  };

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Document name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((item, key) => (
              <StyledTableRow key={key}>
                <StyledTableCell>{item.title}</StyledTableCell>

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
                <StyledTableCell>
                  {item.status === 2 && item.documentType === "Single" && (
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
                  )}
                  {item.status === 2 && item.documentType === "Single" && (
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
                  {item.status === 2 && item.documentType === "Multiple" && (
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleDocumentMultiple(item)}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <VisibilityIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  )}
                  {item.status === 6 && item.documentType === "Multiple" && (
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => handleApplicableDocumentMultiple(item)}
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <VisibilityIcon fontSize="small" />
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
        <SingleDocumentDialog
          open={open}
          setOpen={setOpen}
          itemDocument={itemDocument}
          groupName={groupName}
          registrationId={registrationId}
        />
      )}
      {multiOpen && (
        <MultiDocumentDialog
          open={multiOpen}
          setOpen={setMultiOpen}
          itemDocument={itemDocument}
          groupName={groupName}
          isDownload={isDownload}
          registrationId={registrationId}
          applicable={applicable}
        />
      )}
    </Fragment>
  );
};

export default List;
