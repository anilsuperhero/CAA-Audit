import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import { downloadFile } from "../../../utils/helpers";

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

const List = (props) => {
  const { selectedDocument, applicable } = props;

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            {applicable ? (
              <TableRow>
                <StyledTableCell>Remarks</StyledTableCell>
              </TableRow>
            ) : (
              <TableRow>
                <StyledTableCell>Document name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {selectedDocument &&
              selectedDocument.map((item, key) =>
                applicable ? (
                  <StyledTableRow key={key}>
                    <StyledTableCell>
                      {item.remarks ? item.remarks : "--"}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  <StyledTableRow key={key}>
                    <StyledTableCell>{item.document_name}</StyledTableCell>
                    <StyledTableCell>
                      {item.description ? item.description : "--"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title="Download Document"
                        arrow
                        placement="top"
                        TransitionComponent={Zoom}
                        onClick={() =>
                          downloadFile(
                            item.documentUrl,
                            item.document_image_name
                          )
                        }
                      >
                        <Fab variant="extended" size="small">
                          <CloudDownloadIcon fontSize="small" />
                        </Fab>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default List;
