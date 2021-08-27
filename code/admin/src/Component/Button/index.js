import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #50663c 30%, #50663c 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
  },
  label: {
    textTransform: "capitalize",
  },
});

const Index = (props) => {
  const { title } = props;
  const classes = useStyles();
  const { isSubmitting } = useSelector((state) => ({
    isSubmitting: state.isSubmitting,
  }));
  return (
    <Button
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      size="large"
      color="primary"
      type="submit"
      variant="contained"
      fullWidth
      disabled={isSubmitting ? true : false}
    >
      {isSubmitting ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
          ></span>
        </>
      ) : (
        <>{title}</>
      )}
    </Button>
  );
};
export default Index;
