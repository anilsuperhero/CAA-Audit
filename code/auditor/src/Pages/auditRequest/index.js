import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { AUDIT } from "../../assets/img/index";
import {
  loadData,
  updateRequestData,
  DownloadPersonnel,
  documentRequest,
} from "../../actions/auditRequestActions";
import {
  loadTableHeader,
  loadDialogData,
  loadViewAction,
} from "../../actions/baseActions";
import Breadcrumb from "../../Component/Breadcrumb";
import NotLoad from "../../Component/Table/NotLoad";
import Thead from "../../Component/Table/thead";
import Search from "../../Component/Table/search";
import SetValue from "../../Component/Table/setValue";
import Paginate from "../../Component/Table/Paginate";
import NotFound from "../../Component/Table/NotFound";
import View from "./view";
import List from "./list";
import ChangeStatus from "../../Component/Delete";
import Loader from "../../Component/PreLoader";

function Index(props) {
  const [openDialogView, setOpenDialogView] = useState(false);
  const [item, setItem] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();
  const {
    auditData,
    isData,
    dialogOpen,
    preLoader,
    userAuditorInfo,
    isViewType,
  } = useSelector((state) => ({
    auditData: state.auditData,
    isData: state.isData,
    dialogOpen: state.dialogOpen,
    preLoader: state.preLoader,
    userAuditorInfo: state.userAuditorInfo,
    isViewType: state.isViewType,
  }));
  const location = useLocation();
  const [dialog, setDialog] = useState({});
  const handleCloseView = () => {
    setOpenDialogView(false);
  };
  const queryString = require("query-string");

  const tableHead = [
    {
      title: "Company",
      key: "title",
      type: "string",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=title&direction=asc",
      desc: "sort=title&direction=desc",
      show: true,
    },
    {
      title: "Type",
      key: "type",
      type: "string",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=type&direction=asc",
      desc: "sort=type&direction=desc",
    },
    {
      title: "Status",
      key: "status",
      type: "string",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=status&direction=asc",
      desc: "sort=status&direction=desc",
    },
    {
      title: "Creation date",
      key: "created_at",
      type: "date",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=created_at&direction=asc",
      desc: "sort=created_at&direction=desc",
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

    dispatch(loadData(request));
  }, [dispatch, location, queryString]);

  useEffect(() => {
    dispatch(loadTableHeader(list));
  }, [list, dispatch]);

  const resetPage = () => {
    dispatch(loadTableHeader(tableHead));
    history.push(`/audit-request`);
  };

  const searchData = (data) => {
    const params = new URLSearchParams(location.search);
    if (data.keyword) {
      params.set("keyword", data.keyword);
    }
    history.push({
      pathname: "/audit-request",
      search: "?" + params,
    });
  };

  const handlePageClick = (data) => {
    let page = data;
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    history.push({
      pathname: "/audit-request",
      search: "?" + params,
    });
  };

  const handleViewClick = (item) => {
    setItem(item);
    setOpenDialogView(true);
  };

  const handleChangeStatus = (data, value) => {
    data.statusType = value;
    data.message = `Do you confirm you are starting the ${data.type} audit ref (quote) #${data.title} for company `;
    data.dialogTitle = "Update Status";
    data.open = true;
    data.title = data.company.name;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleChangeStatusAction = (data) => {
    if (data.action) {
      var request = {};
      request.type = data.statusType;
      request.audit_id = data._id;
      request.role = 1;
      if (data.statusType === "SEND_OTHER_DOCUMENT_REQUEST") {
        dispatch(documentRequest(request));
      } else {
        dispatch(updateRequestData(request));
      }
    }
  };

  const downloadKeyPersonnel = (companyId) => {
    dispatch(DownloadPersonnel({ companyId: companyId }));
  };

  const handleSendReportPeer = (data) => {
    data.statusType = "SEND_PEER";
    data.message = "Are you sure, you want send report to peer auditor ";
    data.dialogTitle = "Update Status";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleSendReportCompany = (data) => {
    data.statusType = "SEND_REPORT_COMPANY";
    data.message = "Are you sure, you want send report to company ";
    data.dialogTitle = "Update Status";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleRequestDocument = (data) => {
    data.statusType = "SEND_OTHER_DOCUMENT_REQUEST";
    data.message = `Please confirm you are sending a request for additional documents from `;
    data.dialogTitle = "Documents Request";
    data.title = data.company.name;
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  useEffect(() => {
    if (auditData.length > 0) {
      if (isViewType.audit_id) {
        const item = auditData.find((opt) => opt._id === isViewType.audit_id);
        if (isViewType.viewType === "viewDetails") {
          setItem(item);
          setOpenDialogView(true);
        }
        dispatch(loadViewAction({}));
      }
    }
  }, [auditData, isViewType, dispatch]);

  return (
    <Fragment>
      <Breadcrumb {...props} />
      {preLoader ? (
        <Fragment>
          <div className="right-contant">
            <h3 className="page-sm-title pb-1">{props.title}</h3>
            {isData ? (
              <>
                <SetValue list={list} />
                <Row className="pt-3">
                  <Search
                    onClick={resetPage}
                    onSearch={searchData}
                    date={false}
                    show={false}
                    status={false}
                    title={"Search by company"}
                  />
                </Row>
                <Row>
                  <Col>
                    <Card>
                      <Card.Body className="card code-table">
                        {auditData.length > 0 && (
                          <Paginate onClick={handlePageClick} />
                        )}
                        {auditData.length > 0 ? (
                          <div className="table_scroll">
                            <Table striped responsive>
                              <Thead title={"audit-request"} />
                              <tbody>
                                {auditData &&
                                  auditData.map((item, key) => (
                                    <List
                                      item={item}
                                      key={key}
                                      handleViewClick={handleViewClick}
                                      handleChangeStatus={handleChangeStatus}
                                      userAuditorInfo={userAuditorInfo}
                                      downloadPersonnel={downloadKeyPersonnel}
                                      handleSendReportPeer={
                                        handleSendReportPeer
                                      }
                                      handleSendReportCompany={
                                        handleSendReportCompany
                                      }
                                      handleRequestDocument={
                                        handleRequestDocument
                                      }
                                    />
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <NotFound />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  {dialogOpen && (
                    <ChangeStatus
                      dialog={dialog}
                      handleDeleteClick={handleChangeStatusAction}
                    />
                  )}
                </Row>
              </>
            ) : (
              <NotLoad image={AUDIT} show={false} item={item} />
            )}
          </div>

          {openDialogView && (
            <View
              open={openDialogView}
              handleClose={handleCloseView}
              keyItem={item}
            />
          )}
        </Fragment>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
}

export default Index;
