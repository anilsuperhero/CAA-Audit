import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { AUDIT } from "../../assets/img/index";
import {
  loadData,
  acceptReportAction,
  loadRegistrationGroupData,
} from "../../actions/auditRequestActions";
import {
  loadTableHeader,
  loadDialogData,
  loadViewAction,
} from "../../actions/baseActions";
import Breadcrumb from "../../Component/Breadcrumb";
import NotLoad from "../../Component/Table/NotLoad";
import Thead from "../../Component/Table/thead";
import Paginate from "../../Component/Table/Paginate";
import NotFound from "../../Component/Table/NotFound";
import Delete from "../../Component/Delete";
import Form from "./form";
import View from "./view";
import List from "./list";
import SLAView from "./slaView";
import Payment from "./payment";
import Loader from "../../Component/PreLoader";
import ViewAgreement from "./viewAgreement";

function Index(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogView, setOpenDialogView] = useState(false);
  const [slaViewAction, setSlaViewAction] = useState(false);
  const [slaPaymentAction, setSlaPaymentAction] = useState(false);
  const [viewAgreement, setAgreementAction] = useState(false);
  const [item, setItem] = useState({});
  const [dialog, setDialog] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const { auditData, isData, dialogOpen, preLoader, isViewType } = useSelector(
    (state) => ({
      auditData: state.auditData,
      isData: state.isData,
      dialogOpen: state.dialogOpen,
      preLoader: state.preLoader,
      isViewType: state.isViewType,
    })
  );
  const location = useLocation();
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleCloseView = () => {
    setOpenDialogView(false);
  };
  const queryString = require("query-string");
  const handleFormClick = (item) => {
    setItem(item);
    setOpenDialog(true);
  };

  const tableHead = [
    {
      title: "Quote number",
      key: "title",
      type: "string",
      sort: null,
      class: "fas fa-sort",
      asc: "sort=title&direction=asc",
      desc: "sort=title&direction=desc",
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

  useEffect(() => {
    dispatch(loadRegistrationGroupData());
  }, [dispatch]);

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

  const handleAcceptAction = (data) => {
    if (data.action) {
      dispatch(acceptReportAction({ audit_id: data._id }));
    }
  };

  const handleActionClick = (data) => {
    setItem(data);
  };
  const handlePaymentClick = (data) => {
    setItem(data);
    setSlaPaymentAction(true);
  };

  const handlePaymentCloseClick = () => {
    setSlaPaymentAction(false);
  };

  const handleSlaView = (action) => {
    if (action.paymentView) {
      setItem(action);
      setSlaPaymentAction(true);
      setSlaViewAction(false);
    } else if (action._id) {
      setItem(action);
      setSlaViewAction(true);
    } else {
      setSlaViewAction(false);
    }
  };

  const handleAcceptClick = (data) => {
    data.message = `Are you sure you want to accept the audit report for the audit ref `;
    data.dialogTitle = "Accept Report";
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
        if (isViewType.viewType === "viewSla") {
          setItem(item);
          setSlaViewAction(true);
        }
        if (isViewType.viewType === "singAgreement") {
          setItem(item);
          setAgreementAction(true);
        }
        if (isViewType.viewType === "viewPayment") {
          setItem(item);
          if (item.type === "Certification") {
            if (!item.is_advance) {
              setSlaPaymentAction(true);
            }
            if (!item.is_final) {
              setSlaPaymentAction(true);
            }
          }
          if (item.type === "Verification") {
            if (!item.is_advance) {
              setSlaPaymentAction(true);
            }
          }
        }
        dispatch(loadViewAction({}));
      }
    }
  }, [auditData, isViewType, dispatch]);

  const handleAgreementClick = (type, item) => {
    if (type === "AGREEMENT") {
      setSlaViewAction(false);
      setItem(item);
      setAgreementAction(true);
    }
    if (type === "PAY_INVOICE") {
      setSlaViewAction(false);
      setItem(item);
      setSlaPaymentAction(true);
    }
  };

  const agreementActionClick = (item) => {
    setSlaViewAction(false);
    setItem(item);
    setSlaPaymentAction(true);
    setSlaViewAction(false);
  };

  return (
    <Fragment>
      <Breadcrumb {...props} />
      {preLoader ? (
        <Fragment>
          <div className="right-contant">
            <h3 className="page-sm-title pb-1">{props.title}</h3>
            {isData ? (
              <>
                <Row>
                  <Col>
                    <Card>
                      <Card.Body className="card code-table">
                        {auditData.length > 0 && (
                          <Paginate onClick={handlePageClick} />
                        )}
                        {auditData.length > 0 ? (
                          <Table striped responsive>
                            <Thead title={"audit-request"} />
                            <tbody>
                              {auditData &&
                                auditData.map((item, key) => (
                                  <List
                                    item={item}
                                    key={key}
                                    handleActionClick={handleActionClick}
                                    handleViewClick={handleViewClick}
                                    handleSlaView={handleSlaView}
                                    handlePaymentClick={handlePaymentClick}
                                    handleAcceptClick={handleAcceptClick}
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
              </>
            ) : (
              <NotLoad
                image={AUDIT}
                show={false}
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
          {openDialogView && (
            <View
              open={openDialogView}
              handleClose={handleCloseView}
              keyItem={item}
            />
          )}

          {slaViewAction && (
            <SLAView
              open={slaViewAction}
              handleClose={handleSlaView}
              handleAgreementClick={handleAgreementClick}
              keyItem={item}
            />
          )}
          {slaPaymentAction && (
            <Payment
              open={slaPaymentAction}
              handleClose={handlePaymentCloseClick}
              keyItem={item}
            />
          )}
          {viewAgreement && (
            <ViewAgreement
              open={viewAgreement}
              handleClose={setAgreementAction}
              keyItem={item}
              agreementActionClick={agreementActionClick}
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
