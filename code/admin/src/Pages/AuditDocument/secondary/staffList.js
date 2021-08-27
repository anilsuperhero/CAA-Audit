import React, { Fragment, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import DownloadDialog from "../secondary/downloadListing";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
  const [openDownload, setOpenDownload] = useState(false);
  const [applicable, setApplicable] = useState(false);
  const [itemDocument, setItemDocument] = useState({});

  const documentDownload = (item) => {
    setItemDocument(item);
    setOpenDownload(true);
  };

  const notApplicable = (item) => {
    setApplicable(true);
    setItemDocument(item);
    setOpenDownload(true);
  };

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
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
                  {item.status === 2 && (
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => documentDownload(item)}
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
                  {item.status === 6 && (
                    <Tooltip
                      title="Download Document"
                      arrow
                      placement="top"
                      TransitionComponent={Zoom}
                      onClick={() => notApplicable(item)}
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

      {openDownload && (
        <DownloadDialog
          open={openDownload}
          setOpen={setOpenDownload}
          itemDocument={itemDocument}
          documents={document}
          applicable={applicable}
        />
      )}
    </Fragment>
  );
};

export default List;
