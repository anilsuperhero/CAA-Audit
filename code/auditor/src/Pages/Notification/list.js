import React, { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dateFromNow } from "../../utils/helpers";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Delete from "../../Component/Delete";
import Button from "@material-ui/core/Button";
import { loadDialogData } from "../../actions/baseActions";
import { notification } from "../../assets/img/index";
import { useHistory } from "react-router-dom";
import { loadViewAction } from "../../actions/baseActions";
import { Col, Row } from "react-bootstrap";
import {
  deleteData,
  updateNotification,
  clearAllNotification,
} from "../../actions/notificationActions";
import NotLoad from "../../Component/Table/NotLoad";

const Index = () => {
  const { notificationAuditorList, dialogOpen } = useSelector((state) => ({
    notificationAuditorList: state.notificationAuditorList,
    dialogOpen: state.dialogOpen,
  }));
  const queryString = require("query-string");
  const [dialog, setDialog] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      dispatch(updateNotification());
    }, 2000);
  }, [dispatch]);

  const handleDeleteClick = (data) => {
    if (data._id) {
      if (data.action) {
        dispatch(deleteData(data._id));
      }
    } else {
      if (data.action) {
        dispatch(clearAllNotification());
      }
    }
  };

  const handleRemoveAllClick = (data) => {
    data.message = "Are you sure you want to clear all the notifications";
    data.dialogTitle = "Clear all notifications";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleDeleteItemClick = (data) => {
    data.message = "Are you sure you want to remove the notification ";
    data.dialogTitle = "Delete Notification";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleViewClick = (data) => {
    var query = data.action.split("?").pop();
    const value = queryString.parse(query);
    dispatch(
      loadViewAction({ viewType: value.type, audit_id: value.audit_id })
    );
    history.push(`/audit-request`);
  };

  return (
    <Col lg="12">
      {notificationAuditorList.length > 0 && (
        <div className="pb-3 text-left">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => handleRemoveAllClick({})}
          >
            Clear All
          </Button>
        </div>
      )}
      <Row>
        <Col lg="6">
          {notificationAuditorList.length > 0 &&
            notificationAuditorList.map((item, key) => (
              <div className="pb-3" key={key}>
                <Card className={item.status === 0 ? "card_header" : "header"}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        {item.title[0].toUpperCase()}
                      </Avatar>
                    }
                    action={
                      <Fragment>
                        <IconButton
                          aria-label="settings"
                          onClick={() => handleDeleteItemClick(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          aria-label="settings"
                          onClick={() => handleViewClick(item)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Fragment>
                    }
                    title={item.title}
                    subheader={dateFromNow(item.created_at)}
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      className="pl-5 pt-0"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
        </Col>
      </Row>
      <Row>
        <Col>
          {notificationAuditorList.length === 0 && (
            <NotLoad image={notification} />
          )}
        </Col>
      </Row>

      {dialogOpen && (
        <Delete dialog={dialog} handleDeleteClick={handleDeleteClick} />
      )}
    </Col>
  );
};

export default Index;
