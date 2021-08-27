import React, { Fragment, useEffect } from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Component/PreLoader";
import { getDashboard } from "../../actions/userActions";
import { Row, Col } from "react-bootstrap";

const Index = (props) => {
  const { preLoader, dashboardData } = useSelector((state) => ({
    preLoader: state.preLoader,
    dashboardData: state.dashboardData,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = () => {
      dispatch(getDashboard());
    };
    fetchData();
  }, [dispatch]);

  return (
    <Fragment>
      <Breadcrumb {...props} />
      {preLoader ? (
        <Fragment>
          <div className="right-contant">
            <div className="process-detail">
              <h3 className="page-sm-title">&nbsp;</h3>
            </div>
            <div className="dashboard_info_outer">
              <Row>
                <Col sm={6} md={6} lg={4}>
                  <div className="dashboard_custome_card">
                    <h3>{dashboardData.allAuditCount}</h3>
                    <p>Total number of audits assigned by CAA</p>
                  </div>
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <div className="dashboard_custome_card">
                    <h3>{dashboardData.completedAuditCount}</h3>
                    <p>Number of audits completed</p>
                  </div>
                </Col>
                <Col sm={6} md={6} lg={4}>
                  <div className="dashboard_custome_card">
                    <h3>{dashboardData.progressAuditCount}</h3>
                    <p>Number of audits in process</p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default Index;
