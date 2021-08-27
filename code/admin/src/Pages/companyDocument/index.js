import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Aux from "../../hoc/_Aux";
import { Row, Col, Card, Table } from "react-bootstrap";
import Breadcrumb from "../../Component/Breadcrum";
import Search from "../../Component/Table/search";
import NotFound from "../../Component/Table/NotFound";
import NotLoad from "../../Component/Table/NotLoad";
import Thead from "../../Component/Table/thead";
import SetValue from "../../Component/Table/setValue";
import Paginate from "../../Component/Table/Paginate";
import List from "./list";
import { useSelector, useDispatch } from "react-redux";
import { loadData } from "../../actions/companyDocumentAction";
import { loadTableHeader } from "../../actions/baseActions";
import { useParams } from "react-router-dom";
const queryString = require("query-string");

const Index = (props) => {
  const { title } = props;
  const { isData, otherDocumentData } = useSelector((state) => ({
    isData: state.isData,
    otherDocumentData: state.otherDocumentData,
  }));
  const { slug, company, auditId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
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
  const resetPage = () => {
    dispatch(loadTableHeader(tableHead));
    history.push(
      `/audit-request/company-document/${slug}/${company}/${auditId}`
    );
  };
  const searchData = (data) => {
    const params = new URLSearchParams(location.search);
    params.delete("page");
    if (data.keyword) {
      params.set("keyword", data.keyword);
    }
    if (data.from) {
      params.set("from", data.from);
    }
    if (data.to) {
      params.set("to", data.to);
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
    document.title = title;
    dispatch(loadData(request));
  }, [title, dispatch, location, slug, auditId]);

  useEffect(() => {
    dispatch(loadTableHeader(list));
  }, [dispatch, list]);

  const handleBackButtonClick = () => {
    history.push({ pathname: `/audit-request` });
  };

  return (
    <>
      <Breadcrumb title={title + company} />
      {isData ? (
        <>
          <SetValue list={list} />
          <Aux>
            <Row className="pt-3">
              <Search
                title={"Search by title"}
                onClick={resetPage}
                onSearch={searchData}
                date={false}
                show={false}
                back={true}
                handleBackButtonClick={handleBackButtonClick}
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
                        <Thead
                          title={
                            "/audit-request/company-document/" +
                            slug +
                            "/" +
                            company
                          }
                        />
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
          </Aux>
        </>
      ) : (
        <NotLoad show={false} />
      )}
    </>
  );
};

export default Index;
