import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { loadTableHeader, loadDialogData } from "../../actions/baseActions";
import {
  loadData,
  deleteData,
  auditDocumentSubmit,
} from "../../actions/otherDocumentAction";
import { DOCUMENT } from "../../assets/img/index";
import Breadcrumb from "../../Component/Breadcrumb";
import NotFound from "../../Component/Table/NotFound";
import NotLoad from "../../Component/Table/NotLoad";
import Paginate from "../../Component/Table/Paginate";
import SetValue from "../../Component/Table/setValue";
import Thead from "../../Component/Table/thead";
import List from "./list";
import Form from "./form";
import Delete from "../../Component/Delete";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #50663c 30%, #50663c 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
  },
  label: {
    textTransform: "capitalize",
  },
});

function Index(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const { otherDocumentData, isData, dialogOpen } = useSelector((state) => ({
    otherDocumentData: state.otherDocumentData,
    isData: state.isData,
    dialogOpen: state.dialogOpen,
  }));
  const location = useLocation();
  const queryString = require("query-string");
  const [item, setItem] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState({});

  const tableHead = [
    {
      title: "Title",
      key: "title",
      type: "string",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=title&direction=asc",
      desc: "sort=title&direction=desc",
    },
    {
      title: "Latest update",
      key: "updated_at",
      type: "date",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=updated_at&direction=asc",
      desc: "sort=updated_at&direction=desc",
    },
  ];
  const [list] = useState(tableHead);
  let { slug } = useParams();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryStringParsed = queryString.parse(location.search);
    const request = {};
    if (params.get("sort")) {
      var sort = queryStringParsed["sort"];
      var direction = queryStringParsed["direction"];
      request.sort = sort;
      request.direction = direction;
    }
    if (params.get("page")) {
      var page = queryStringParsed["page"];
      request.page = page;
    }
    if (params.get("keyword")) {
      var keyword = queryStringParsed["keyword"];
      request.keyword = keyword;
    }
    request.audit_id = slug;
    dispatch(loadData(request));
  }, [dispatch, location, queryString, slug]);

  useEffect(() => {
    dispatch(loadTableHeader(list));
  }, [list, dispatch]);

  const handlePageClick = (data) => {
    let page = data;
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    history.push({
      pathname: "/user/documents",
      search: "?" + params,
    });
  };

  const handleFormClick = (item) => {
    setItem(item);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteClick = (data) => {
    data.requestType = "delete";
    data.message = "Are you sure, you want to delete ";
    data.dialogTitle = "Delete Document";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleAcceptAction = (data) => {
    if (data.action) {
      if (data.requestType === "delete") {
        dispatch(deleteData(data._id, slug));
      }
      if (data.requestType === "document") {
        dispatch(auditDocumentSubmit(slug));
      }
    }
  };

  const handleDocumentRequest = () => {
    const data = {};
    data.requestType = "document";
    data.audit_id = slug;
    data.message =
      "Are you sure, you want to send additional documents for auditor ";
    data.dialogTitle = "Additional document";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  return (
    <Fragment>
      <Breadcrumb {...props} />
      <div className="right-contant">
        <h3 className="page-sm-title pb-1">Additional documents</h3>
        {isData ? (
          <Fragment>
            <SetValue list={list} />
            <Row className="pt-3">
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>
                      <div className="float-right pr-3">
                        <Button
                          size="large"
                          classes={{
                            root: classes.root,
                            label: classes.label,
                          }}
                          variant="contained"
                          onClick={() => handleFormClick({})}
                          startIcon={<AddCircleIcon fontSize="large" />}
                        >
                          Add New
                        </Button>

                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          className="ml-2 login-btn green-bg search_button"
                          onClick={handleDocumentRequest}
                        >
                          Send To Auditor
                        </Button>
                      </div>
                    </Card.Title>
                  </Card.Header>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body className="card code-table">
                    {otherDocumentData.length > 0 && (
                      <Paginate onClick={handlePageClick} />
                    )}
                    {otherDocumentData.length > 0 ? (
                      <Table striped responsive>
                        <Thead title={"user/documents"} />
                        <tbody>
                          {otherDocumentData &&
                            otherDocumentData.map((item, key) => (
                              <List
                                item={item}
                                key={key}
                                handleFormClick={handleFormClick}
                                handleDeleteClick={handleDeleteClick}
                              />
                            ))}
                        </tbody>
                      </Table>
                    ) : (
                      <NotFound />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Fragment>
        ) : (
          <NotLoad
            image={DOCUMENT}
            show={true}
            handleFormClick={handleFormClick}
            item={item}
          />
        )}
      </div>
      {openDialog && (
        <Form open={openDialog} handleClose={handleClose} keyItem={item} />
      )}
      {dialogOpen && (
        <Delete dialog={dialog} handleDeleteClick={handleAcceptAction} />
      )}
    </Fragment>
  );
}

export default Index;
