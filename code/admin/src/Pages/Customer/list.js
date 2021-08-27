import React, { useState } from "react";
import { Tooltip, Zoom, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { date } from "../../utils/helpers";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenSharpIcon from "@material-ui/icons/LockOpenSharp";
import Switch from "../../Component/Switch";
import PeopleIcon from "@material-ui/icons/People";
import { useHistory } from "react-router-dom";

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
  let history = useHistory();
  const classes = useStyles();
  const handleclick = (item, action) => {
    props.handleFormClick(item, action);
  };
  const handleChangePasswordclick = (item, action) => {
    props.handlePasswordClick(item, action);
  };
  const [state, setState] = useState({
    status: item.status,
  });

  const handleChange = (params) => {
    props.handleSwitchClick(params);
    setState({
      ...props.item.status,
      [params.name]: params.status,
    });
  };
  const handleDeleteclick = () => {
    props.handleDeleteClick(item);
  };

  const viewKeyPersonnel = () => {
    history.push(`/key-personnel?companyId=${item._id}`);
  };
  return (
    <>
      <tr key={state} className="itemListing">
        <td>{item.company_name + " (" + item.abn_number + ")"}</td>
        <td>{item.first_name + " " + item.last_name}</td>
        <td>{item.email}</td>
        <td>{item.mobile_number}</td>
        <td>{date(item.created_at)}</td>
        <td>
          <Switch item={item} onChange={handleChange} />
          <Tooltip
            title="Edit"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={() => handleclick(item, true)}
          >
            <Fab
              variant="extended"
              size="small"
              color="inherit"
              className={classes.margin}
            >
              <EditIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Delete"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={handleDeleteclick}
          >
            <Fab
              variant="extended"
              size="small"
              color="secondary"
              className={classes.margin}
            >
              <DeleteIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Change Password"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={() => handleChangePasswordclick(item, true)}
          >
            <Fab
              variant="extended"
              size="small"
              color="primary"
              className={classes.margin}
            >
              <LockOpenSharpIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip
            title="Key Personnel"
            arrow
            placement="top"
            TransitionComponent={Zoom}
            onClick={() => viewKeyPersonnel(item, true)}
          >
            <Fab
              variant="extended"
              size="small"
              color="inherit"
              className={classes.margin}
            >
              <PeopleIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </td>
      </tr>
    </>
  );
};

export default List;
