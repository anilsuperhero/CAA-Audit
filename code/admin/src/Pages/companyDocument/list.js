import React from "react";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { date, downloadFile } from "../../utils/helpers";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

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
    <>
      <tr key={item._id} className="itemListing">
        <th scope="row">{item.title}</th>
        <td>{date(item.updated_at)}</td>
        <td>
          <Tooltip
            title="Download Receipt"
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
      </tr>
    </>
  );
};

export default List;
