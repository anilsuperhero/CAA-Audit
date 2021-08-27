import React, { useEffect, Fragment } from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { getDashboard } from "../../actions/userActions";
import { Row, Col } from "react-bootstrap";

const Dashboard = (props) => {
  const { dashboardData } = useSelector((state) => ({
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
      <div className="right-contant">
        <div className="process-detail">
          <h3 className="page-sm-title">Dashboard</h3>
        </div>
        <div className="dashboard_info_outer">
          <h2>Status</h2>
          <Row>
            <Col sm={6} md={6} lg={3}>
              <div className="dashboard_custome_card">
                <h3>Dashboard</h3>
                <p>Lorem Ipsom dolor site ament this text dummy</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
