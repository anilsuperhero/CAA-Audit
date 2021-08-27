import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { loadAuditRequest } from "../../actions/documentAction";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CompanyAccordion from "./companyDocumentAccordion";

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

const Index = (props) => {
  const { title } = props;
  const dispatch = useDispatch();
  const { slug } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { auditRequestData } = useSelector((state) => ({
    auditRequestData: state.auditRequestData,
  }));

  useEffect(() => {
    const fetchData = () => {
      dispatch(loadAuditRequest({ slug: slug }));
    };
    fetchData();
  }, [dispatch, slug]);

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Breadcrumb title={title} />
      {auditRequestData ? (
        <>
          <div className="right-contant">
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>
                      Documents uploaded by &nbsp;
                      <b>{auditRequestData.company_id.company_name}</b>
                      <Button
                        variant="contained"
                        className="float-right ml-2"
                        startIcon={<ArrowBackIosIcon />}
                        onClick={() => history.goBack()}
                      >
                        Back
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
                              <Typography>{item.title}</Typography>
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
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Index;
