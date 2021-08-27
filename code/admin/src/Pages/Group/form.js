import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  submitRegistrationgroupData,
  createRegistrationgroupData,
} from "../../actions/registrationGroupActions";
import { withStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import SubmitButton from "../../Component/Button";
import BackButton from "../../Component/BackButton";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme, checkSpace } from "../../utils/helpers";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#50663c",
    },
    "& .Mui-focused": {
      color: "#50663c",
    },
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#87c846",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#87c846",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const FormModal = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { item } = props;
  const history = useHistory();
  const goToPreviousPath = () => {
    history.goBack();
  };
  const { register, errors, handleSubmit } = useForm();
  const onSubmit = (data) => {
    data.is_default = state;
    if (item._id) {
      dispatch(submitRegistrationgroupData(data, goToPreviousPath));
    } else {
      dispatch(createRegistrationgroupData(data, goToPreviousPath));
    }
  };

  const [state, setState] = useState(item.is_default ? item.is_default : false);
  const [groupType] = useState([
    { title: "Verification", id: "VERIFICATION" },
    { title: "Certification", id: "CERTIFICATION" },
    { title: "Both", id: "BOTH" },
  ]);
  const handleChange = (event) => {
    setState(event.target.checked);
  };
  const defaultValue = () => {
    if (item.type === "VERIFICATION") {
      return groupType[0];
    }
    if (item.type === "CERTIFICATION") {
      return groupType[1];
    }
    if (item.type === "BOTH") {
      return groupType[2];
    }
  };
  return (
    <>
      <MuiThemeProvider theme={formLabelsTheme}>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <Row>
            <Col xs={4} md={4} xl={4} xxl={4}>
              <Form.Control
                type="hidden"
                name="id"
                defaultValue={item._id}
                ref={register({})}
              />
              <Form.Group controlId="formBasicTitle">
                <TextField
                  id="outlined-basic"
                  required
                  label="Title"
                  defaultValue={item.title}
                  variant="outlined"
                  autoFocus={true}
                  fullWidth
                  className={!errors.title ? classes.root : "w-100"}
                  error={errors.title ? true : false}
                  name="title"
                  inputRef={register({
                    required: "Please enter title.",
                    minLength: {
                      value: 3,
                      message: "Title should contain at least 3 characters.",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Title should not exceed 1000 characters.",
                    },
                    validate: {
                      isSpace: (value) =>
                        checkSpace(value) ||
                        "Remove trailing spaces from title.",
                    },
                  })}
                  helperText={errors.title && errors.title.message}
                />
              </Form.Group>
              <Form.Group controlId="formBasicCompany">
                <Autocomplete
                  id="combo-box-demo"
                  options={groupType}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Choose group type"
                      variant="outlined"
                      fullWidth
                      error={errors.type ? true : false}
                      name="type"
                      inputRef={register({
                        required: "Please choose any one type.",
                      })}
                      helperText={errors.type && errors.type.message}
                    />
                  )}
                  defaultValue={defaultValue}
                />
              </Form.Group>
            </Col>
            <Col xs={6} md={6} xl={6} xxl={6}>
              <Form.Group controlId="formBasicTitle">
                <FormControlLabel
                  control={
                    <IOSSwitch
                      checked={state}
                      onChange={handleChange}
                      name="is_default"
                    />
                  }
                  label="Default Selected"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={2} md={2} xl={2} xxl={1}>
              <SubmitButton title={item._id ? "Update" : "Submit"} />
            </Col>
            <Col xs={2} md={2} xl={2} xxl={1}>
              <BackButton onClick={() => goToPreviousPath()} />
            </Col>
          </Row>
        </Form>
      </MuiThemeProvider>
    </>
  );
};

export default FormModal;
