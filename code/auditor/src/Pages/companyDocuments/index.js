import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { loadTableHeader } from "../../actions/baseActions";
import { loadData } from "../../actions/otherDocumentAction";
import { DOCUMENT } from "../../assets/img/index";
import Breadcrumb from "../../Component/Breadcrumb";
import NotFound from "../../Component/Table/NotFound";
import NotLoad from "../../Component/Table/NotLoad";
import Paginate from "../../Component/Table/Paginate";
import Search from "../../Component/Table/search";
import SetValue from "../../Component/Table/setValue";
import Thead from "../../Component/Table/thead";
import List from "./list";
import { useParams } from "react-router-dom";

function Index(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { otherDocumentData, isData } = useSelector((state) => ({
    otherDocumentData: state.otherDocumentData,
    isData: state.isData,
  }));
  const location = useLocation();
  const queryString = require("query-string");
  const { slug, company, auditId } = useParams();

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
      title: "Creation date",
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
    request.companyId = slug;
    request.audit_id = auditId;
    dispatch(loadData(request));
  }, [dispatch, location, queryString, slug, auditId]);

  useEffect(() => {
    dispatch(loadTableHeader(list));
  }, [list, dispatch]);

  const resetPage = () => {
    dispatch(loadTableHeader(tableHead));
    history.push({
      pathname: `/audit-request/company-document/${slug}/${company}/${auditId}`,
    });
  };

  const searchData = (data) => {
    const params = new URLSearchParams(location.search);
    if (data.keyword) {
      params.set("keyword", data.keyword);
    }
    history.push({
      pathname: `/audit-request/company-document/${slug}/${company}/${auditId}`,
      search: "?" + params,
    });
  };

  const handlePageClick = (data) => {
    let page = data;
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    history.push({
      pathname: `/audit-request/company-document/${slug}/${company}/${auditId}`,
      search: "?" + params,
    });
  };

  return (
    <Fragment>
      <Breadcrumb {...props} />
      <div className="right-contant">
        <h3 className="page-sm-title pb-1">
          Additional documents uploaded by {company}
        </h3>
        {isData ? (
          <Fragment>
            <SetValue list={list} />
            <Row className="pt-3">
              <Search
                onClick={resetPage}
                onSearch={searchData}
                date={false}
                show={false}
                transaction={true}
                status={false}
                back={true}
                title={"Search by title"}
                handleBackButtonClick={() => history.goBack()}
              />
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
                              <List item={item} key={key} />
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
          <NotLoad image={DOCUMENT} back={true} />
        )}
      </div>
    </Fragment>
  );
}

export default Index;
