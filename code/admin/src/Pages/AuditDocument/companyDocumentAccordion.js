import React, { useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import List from "./group/company/list";
import StaffList from "./staffAccordion";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
  },
}));

function CompanyAccordion(props) {
  const { document, groupName, registrationId } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root + " documentUpload"}>
      {document.company.length > 0 && (
        <Accordion expanded={expanded === 0} onChange={handleChange(0)} key={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className="companyIcons"
          >
            <Typography className={classes.heading}>
              Company's Document
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List
              documents={document.company}
              groupName={groupName}
              registrationId={registrationId}
            />
          </AccordionDetails>
        </Accordion>
      )}
      {document.staff && document.staff.length > 0 && (
        <Accordion expanded={expanded === 1} onChange={handleChange(1)} key={1}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            className="companyIcons"
          >
            <Typography className={classes.heading}>
              Staff's Document
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StaffList
              documents={document.staff}
              groupName={groupName}
              registrationId={registrationId}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}

export default CompanyAccordion;
