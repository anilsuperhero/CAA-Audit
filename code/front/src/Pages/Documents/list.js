import { Fab, Tooltip, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React, { Fragment } from "react";
import { date, downloadFile } from "../../utils/helpers";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const List = (props) => {
  const { item } = props;
  const classes = useStyles();

  const handleDownloadClick = () => {
    downloadFile(item.image, item.document_name);
  };

  const handleDeleteClick = () => {
    props.handleDeleteClick(item);
  };

  const handleClick = (item, action) => {
    props.handleFormClick(item, action);
  };

  return (
    <Fragment>
      <tr className="itemListing">
        <td>
          <Tooltip
            title="Download Document"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={handleDownloadClick}
          >
            <Fab variant="extended" size="small" className={classes.margin}>
              <CloudDownloadIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Delete"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={handleDeleteClick}
          >
            <Fab variant="extended" size="small" className={classes.margin}>
              <DeleteIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Edit"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={() => handleClick(item, true)}
          >
            <Fab variant="extended" size="small" className={classes.margin}>
              <EditIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </td>
        <th scope="row">{item.title}</th>
        <td>{date(item.created_at)}</td>
      </tr>
    </Fragment>
  );
};

export default List;
