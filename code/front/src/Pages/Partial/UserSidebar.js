import React from "react";
import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  function show() {
    document.getElementById("onscroll").classList.toggle("showsidebar");
  }
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const { dashboardData } = useSelector((state) => ({
    dashboardData: state.dashboardData,
  }));

  return (
    <>
      <Button onClick={show} className="navtoggle" size="large">
        <i className="fas fa-arrow-right"></i>
      </Button>
      <div className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              className="App-link dark-gray"
              exact
              activeClassName="active"
              to="/user/dashboard"
            >
              <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className={
                splitLocation[1] === "audit-request"
                  ? "App-link dark-gray active"
                  : "App-link dark-gray"
              }
              exact
              activeClassName="active"
              to="/audit-request"
            >
              <i className="fas fa-book-open"></i>
              <span>Audit Details</span>
            </NavLink>
          </li>
          {dashboardData.is_advance && (
            <li>
              <NavLink
                className="App-link dark-gray"
                exact
                activeClassName="active"
                to={`/document-update/${dashboardData.id}`}
              >
                <i className="fas fa-file-alt"></i>
                <span>Upload Documents </span>
              </NavLink>
            </li>
          )}
          {dashboardData.required_additional_doc && (
            <li>
              <NavLink
                className="App-link dark-gray"
                exact
                activeClassName="active"
                to={`/additional/documents/${dashboardData.id}`}
              >
                <i className="fas fa-file-alt"></i>
                <span>Additional Documents </span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              className="App-link dark-gray"
              exact
              activeClassName="active"
              to="/user/transactions"
            >
              <i className="fas fa-file-alt"></i> <span>Transactions </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className="App-link dark-gray"
              exact
              activeClassName="active"
              to="/user/key-person"
            >
              <i className="fas fa-users"></i>
              <span>Key Personnel</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              className="App-link dark-gray"
              exact
              activeClassName="active"
              to="/user/profile"
            >
              <i className="far fa-user"></i>
              <span>My Account</span>
            </NavLink>
          </li>

          {(dashboardData.status === "ASSIGNED" ||
            dashboardData.status === "PROGRESS" ||
            dashboardData.status === "REPORT_UPLOAD" ||
            dashboardData.status === "REPORT_REJECT" ||
            dashboardData.status === "ACCEPT_REPORT") && (
            <li>
              <NavLink
                className="App-link dark-gray"
                exact
                activeClassName="active"
                to={`/chat/${dashboardData.id}/${dashboardData.chat_audit_number}`}
              >
                <i className="fas fa-comments"></i>
                <span>Chat</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              className="App-link dark-gray"
              exact
              activeClassName="active"
              to="/user/notification"
            >
              <i className="far fa-bell"></i>
              <span>Notifications</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
