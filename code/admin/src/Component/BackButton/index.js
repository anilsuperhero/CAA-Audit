import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #dc3545 30%, #dc3545 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px #dc3545",
  },
  label: {
    textTransform: "capitalize",
  },
});

const Index = (props) => {
  const classes = useStyles();
  const handleClick = () => {
    props.onClick();
  };
  return (
    <Button
      size="large"
      variant="contained"
      fullWidth
      onClick={() => handleClick()}
      startIcon={<ArrowBackIcon />}
    >
      Back
    </Button>
  );
};
export default Index;
