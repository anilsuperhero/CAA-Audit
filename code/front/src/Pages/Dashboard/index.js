import React, { Fragment, useEffect } from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Component/PreLoader";
import { getDashboard } from "../../actions/userActions";
import { loadViewAction } from "../../actions/baseActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const Index = (props) => {
  const { preLoader, dashboardData } = useSelector((state) => ({
    preLoader: state.preLoader,
    dashboardData: state.dashboardData,
  }));
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const queryString = require("query-string");
  const location = useLocation();

  useEffect(() => {
    const fetchData = () => {
      dispatch(getDashboard());
    };
    fetchData();
  }, [dispatch]);

  const historyUpdate = (type) => {
    dispatch(loadViewAction({ viewType: type, audit_id: dashboardData.id }));
    history.push(`/audit-request`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryStringParsed = queryString.parse(location.search);
    if (params.get("type")) {
      dispatch(
        loadViewAction({
          viewType: queryStringParsed["type"],
          audit_id: queryStringParsed["audit_id"],
        })
      );
      history.push(`/audit-request`);
    }
  }, [location, queryString, dispatch, history]);

  return (
    <Fragment>
      <Breadcrumb {...props} />
      {preLoader ? (
        <Fragment>
          <div className="right-contant">
            <div className="process-detail">
              <h3 className="page-sm-title">Dashboard</h3>
              {dashboardData.id && (
                <div className="block-outer">
                  <h4 className="small-title">Details of in Process Audit</h4>
                  <div className="detail-process">
                    <ul>
                      <li>
                        <h6>Quote Number:</h6>#{dashboardData.audit_number}
                      </li>
                      <li>
                        <h6>Audit Type:</h6>
                        {dashboardData.typeView}
                      </li>
                      <li>
                        <h6>Current Stage:</h6> {dashboardData.current}
                      </li>
                      {dashboardData.next_step && (
                        <li>
                          <h6>Next Step:</h6> {dashboardData.next_step}
                        </li>
                      )}
                      <li>
                        <h6>Expected Completion Date:</h6> {dashboardData.date}
                      </li>
                    </ul>
                    <div className={classes.root}>
                      <Button
                        size="large"
                        variant="contained"
                        className="login-btn green-bg search_button"
                        onClick={() => historyUpdate("viewDetails")}
                      >
                        Audit details
                      </Button>
                      {dashboardData.status === "CREATED" && (
                        <Button
                          size="large"
                          variant="contained"
                          className="login-btn green-bg search_button"
                          onClick={() => historyUpdate("singAgreement")}
                        >
                          SIGN AGREEMENT
                        </Button>
                      )}
                      {dashboardData.status === "SLASIGNED" && (
                        <Button
                          size="large"
                          variant="contained"
                          className="login-btn green-bg search_button"
                          onClick={() => historyUpdate("viewPayment")}
                        >
                          Pay Invoice
                        </Button>
                      )}
                      {dashboardData.is_request === 1 && (
                        <Button
                          size="large"
                          variant="contained"
                          className="login-btn green-bg search_button"
                          onClick={() => {
                            history.push(
                              `/additional/documents/${dashboardData.id}`
                            );
                          }}
                        >
                          Add Other Documents
                        </Button>
                      )}
                      {dashboardData.is_advance && (
                        <Button
                          size="large"
                          variant="contained"
                          className="login-btn green-bg search_button"
                          onClick={() => {
                            history.push(
                              `/document-update/${dashboardData.id}`
                            );
                          }}
                        >
                          {dashboardData.is_request === 0
                            ? "Upload Documents"
                            : "View Documents"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {dashboardData.id && dashboardData.type === "VERIFICATION" && (
              <div className="audit-process">
                <div className="block-outer">
                  <h4 className="small-title">Audit Process</h4>
                  <div className="audit-process-number">
                    <div className="App">
                      <div className="process-list-outer">
                        {dashboardData.audit_process &&
                          dashboardData.audit_process.map((item, key) => (
                            <Fragment key={key}>
                              <div
                                className={
                                  "process-listing " +
                                  ((key === 0 || item.log.created_at) &&
                                    "success")
                                }
                              >
                                <strong>{item.title}</strong>
                                {item.date && (
                                  <span className="created_date">
                                    {item.date}
                                  </span>
                                )}
                              </div>
                            </Fragment>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dashboardData.id && dashboardData.type === "CERTIFICATION" && (
              <div className="audit-process">
                <div className="block-outer">
                  <h4 className="small-title">Audit Process</h4>
                  <div className="audit-process-number">
                    <div className="App">
                      <div className="process-list-outer">
                        {dashboardData.audit_process &&
                          dashboardData.audit_process.map((item, key) => (
                            <Fragment key={key}>
                              <div
                                className={
                                  "process-listing " +
                                  ((key === 0 || item.log.created_at) &&
                                    "success")
                                }
                              >
                                <strong>{item.title}</strong>
                                {key === 0 ? (
                                  <span className="created_date">
                                    {item.date}
                                  </span>
                                ) : (
                                  item.date && (
                                    <span className="created_date">
                                      {item.date}
                                    </span>
                                  )
                                )}
                                {item.estimated_date && (
                                  <span className="estimate">
                                    Estimated Date:&nbsp;{item.estimated_date}
                                  </span>
                                )}
                              </div>
                            </Fragment>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default Index;
