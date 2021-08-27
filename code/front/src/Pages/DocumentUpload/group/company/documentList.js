import React, { Fragment, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import { downloadFile } from "../../../../utils/helpers";
import DeleteIcon from "@material-ui/icons/Delete";
import { loadDialogData } from "../../../../actions/baseActions";
import { useDispatch, useSelector } from "react-redux";
import Delete from "../../../../Component/Delete";
import {
  deleteDocument,
  getMultiDocument,
} from "../../../../actions/documentAction";
import { useParams } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DocumentForm from "./updateDocumentForm";

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
  const {
    selectedDocument,
    itemDocument,
    registrationId,
    setSelectedDocument,
    isDownload,
  } = props;
  const classes = useStyles();
  const [dialog, setDialog] = useState({});
  const [documentUpload, setDocumentUpload] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(false);

  const dispatch = useDispatch();
  let { slug } = useParams();
  const { dialogOpen } = useSelector((state) => ({
    dialogOpen: state.dialogOpen,
  }));

  const loadDocument = () => {
    const request = {};
    request.audit_id = slug;
    request.registration_id = registrationId;
    request.document_id = itemDocument.id;
    request.type = "COMPANY-MULTI";
    dispatch(getMultiDocument(request, setSelectedDocument));
  };

  const handleDeleteClick = (data) => {
    if (data.action) {
      dispatch(deleteDocument({ id: data._id }, loadDocument));
    } else {
      data.message = "Are you sure, you want to delete ";
      data.title = data.document_name;
      data.dialogTitle = "Delete Document";
      data.open = true;
      setDialog(data);
      dispatch(loadDialogData(true));
    }
  };

  const documentUpdateClick = (item) => {
    setCurrentDocument(item);
    setDocumentUpload(true);
  };

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Document name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedDocument &&
              selectedDocument.map((item, key) => (
                <StyledTableRow key={key}>
                  <StyledTableCell>{item.document_name}</StyledTableCell>
                  <StyledTableCell>{item.description}</StyledTableCell>
                  <StyledTableCell>
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() =>
                        downloadFile(item.documentUrl, item.document_image_name)
                      }
                    >
                      <Fab
                        variant="extended"
                        size="small"
                        className={classes.margin}
                      >
                        <CloudDownloadIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                    {!isDownload && (
                      <Tooltip
                        title="Update Document"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={() => documentUpdateClick(item)}
                      >
                        <Fab
                          variant="extended"
                          size="small"
                          className="ml-3"
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    )}
                    {!isDownload && (
                      <Tooltip
                        title="Delete Document"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Fab
                          variant="extended"
                          size="small"
                          className="ml-3"
                          color="secondary"
                        >
                          <DeleteIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {documentUpload && (
        <DocumentForm
          open={documentUpload}
          setOpen={setDocumentUpload}
          itemDocument={itemDocument}
          currentDocument={currentDocument}
          registrationId={registrationId}
          setSelectedDocument={setSelectedDocument}
        />
      )}

      {dialogOpen && (
        <Delete dialog={dialog} handleDeleteClick={handleDeleteClick} />
      )}
    </Fragment>
  );
};

export default List;
