import React, { useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import List from "./staffDocument";

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

function KeyPersonAccordion(props) {
  const { keyPerson, document } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root + " documentUpload"}>
      {keyPerson &&
        keyPerson.map((item, key) => (
          <Accordion
            expanded={expanded === key}
            onChange={handleChange(key)}
            key={key}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                {item.first_name + " " + item.last_name} ({item.positionHeld})
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {item.email}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List documents={document} />
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

export default KeyPersonAccordion;
