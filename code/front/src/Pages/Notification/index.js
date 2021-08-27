import React from "react";
import List from "./list";
import Breadcrumb from "../../Component/Breadcrumb";

const Index = (props) => {
  return (
    <>
      <Breadcrumb {...props} />
      <div className="right-contant">
        <h3 className="page-sm-title pb-1">Notifications</h3>
        <div className="myaccount-outer">
          <List />
        </div>
      </div>
    </>
  );
};

export default Index;
