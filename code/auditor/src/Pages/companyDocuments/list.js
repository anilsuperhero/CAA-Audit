import { Fab, Tooltip, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import React, { Fragment } from "react";
import { date, downloadFile } from "../../utils/helpers";

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
            <Fab
              variant="extended"
              size="small"
              color="primary"
              className={classes.margin}
            >
              <CloudDownloadIcon fontSize="small" />
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
