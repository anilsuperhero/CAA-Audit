import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../Component/Breadcrumb";
import { loadData } from "../../actions/keyPersonalActions";
import {
  loadAuditRequest,
  updateAuditRequest,
} from "../../actions/documentAction";
import { useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CompanyAccordion from "./companyDocumentAccordion";
import RequestDialog from "./request/requestDialog";
import KeyPersonDialog from "./keyPersonDialog";
import NotLoad from "../../Component/Table/NotLoad";
import NotLoadDocument from "./NotLoadDocument";
import { AUDIT } from "../../assets/img/index";
import ConformationDialog from "./request/conformationDialog";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    width: "100%",
    padding: "1%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

function Index(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { slug } = useParams();
  const { auditRequestData, keyPerson } = useSelector((state) => ({
    auditRequestData: state.auditRequestData,
    keyPerson: state.keyPerson,
  }));

  useEffect(() => {
    const fetchData = () => {
      dispatch(loadData({}));
      dispatch(loadAuditRequest({ slug: slug }));
    };
    fetchData();
  }, [dispatch, slug]);

  useEffect(() => {
    if (auditRequestData.type === "VERIFICATION") {
      if (auditRequestData.keyStaff) {
        if (auditRequestData.keyStaff.length === 0) {
          setOpen(true);
        }
      }
    } else {
      if (auditRequestData.type === "CERTIFICATION") {
        if (!auditRequestData.isCertification) {
          dispatch(updateAuditRequest({ slug: slug }));
        }
      }
    }
  }, [
    auditRequestData.keyStaff,
    auditRequestData.type,
    dispatch,
    slug,
    auditRequestData.isCertification,
  ]);

  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [conformationDialog, setConformationDialog] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { setting } = useSelector((state) => ({
    setting: state.setting,
  }));

  const submitRequest = () => {
    setRequestDialog(true);
  };

  const handleConformation = (type) => {
    if (type) {
      setConformationDialog(true);
    }
    setRequestDialog(false);
  };

  return (
    <Fragment>
      <Breadcrumb {...props} />
      {auditRequestData ? (
        auditRequestData.is_request === 1 ||
        auditRequestData.is_request === 0 ? (
          <div className="right-contant">
            <h3 className="page-sm-title pb-1">
              Documents upload for audit reference "{auditRequestData.title}"
            </h3>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>
                      <Fragment>
                        <Badge
                          badgeContent={
                            auditRequestData.total_document -
                            auditRequestData.uploaded_document
                          }
                          color="primary"
                        >
                          <Button
                            variant="contained"
                            className="not_start"
                            size="large"
                          >
                            {setting.not_started}
                          </Button>
                        </Badge>
                      </Fragment>
                      &nbsp;&nbsp;&nbsp;
                      <Fragment>
                        <Badge
                          badgeContent={auditRequestData.onGoing}
                          color="primary"
                        >
                          <Button
                            variant="contained"
                            className="amber_button"
                            size="large"
                          >
                            {setting.on_going}
                          </Button>
                        </Badge>
                      </Fragment>
                      &nbsp;&nbsp;&nbsp;
                      <Fragment>
                        <Badge
                          badgeContent={auditRequestData.uploaded_document}
                          color="primary"
                        >
                          <Button
                            variant="contained"
                            className="green_completed"
                            size="large"
                          >
                            {setting.completed}
                          </Button>
                        </Badge>
                      </Fragment>
                      <Button
                        size="large"
                        variant="contained"
                        className="float-right ml-2"
                        startIcon={<ArrowBackIosIcon />}
                        onClick={() => history.goBack()}
                      >
                        Back
                      </Button>
                      <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        className={
                          auditRequestData.total_document >
                            auditRequestData.uploaded_document ||
                          auditRequestData.is_request === 1
                            ? "float-right"
                            : "float-right login-btn green-bg search_button "
                        }
                        onClick={submitRequest}
                        disabled={
                          auditRequestData.total_document >
                            auditRequestData.uploaded_document ||
                          auditRequestData.is_request === 1
                            ? true
                            : false
                        }
                      >
                        Click to submit & Request audit date
                      </Button>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="card code-table">
                    <div className={classes.root + " documentUpload"}>
                      {auditRequestData.selectedDocument &&
                        auditRequestData.selectedDocument.map((item, key) => (
                          <Accordion
                            expanded={expanded === key}
                            onChange={handleChange(key)}
                            key={key}
                          >
                            <AccordionSummary
                              className="groupIcons"
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1bh-content"
                              id="panel1bh-header"
                            >
                              <Typography>{item.title} </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {item.documents && (
                                <CompanyAccordion
                                  document={item.documents}
                                  keyPerson={
                                    auditRequestData.key_primaryDocument
                                  }
                                  groupName={item.title}
                                  registrationId={item.id}
                                />
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {open && (
              <KeyPersonDialog
                open={open}
                setOpen={setOpen}
                keyPerson={keyPerson}
                slug={slug}
              />
            )}
            {requestDialog && (
              <RequestDialog
                open={requestDialog}
                setOpen={handleConformation}
                slug={slug}
              />
            )}
            {conformationDialog && (
              <ConformationDialog open={conformationDialog} />
            )}
          </div>
        ) : (
          <div className="right-contant">
            <h3 className="page-sm-title pb-1">
              Document upload for "{auditRequestData.title} (
              {auditRequestData.audit_number})"
            </h3>
            <NotLoadDocument image={AUDIT} />
          </div>
        )
      ) : (
        <div className="right-contant">
          <NotLoad
            image={AUDIT}
            show={false}
            handleFormClick={() => history.goBack()}
            item={{}}
          />
        </div>
      )}
    </Fragment>
  );
}

export default Index;
