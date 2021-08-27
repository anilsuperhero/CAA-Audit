import React from "react";
import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  function show() {
    document.getElementById("onscroll").classList.toggle("showsidebar");
  }
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  return (
    <>
      <Button onClick={show} className="navtoggle">
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
              <span>Audits</span>
            </NavLink>
          </li>

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
        </ul>
      </div>
    </>
  );
};
export default Sidebar;
