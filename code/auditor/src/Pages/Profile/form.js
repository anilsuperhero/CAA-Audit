import { makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { updateProfileData } from "../../actions/userActions";
import SubmitButton from "../../Component/Button";
import { MuiThemeProvider } from "@material-ui/core/styles";

import {
  ValidateAlpha,
  formLabelsTheme,
  checkSpace,
  checkMobileNumber,
} from "../../utils/helpers";

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
const Index = (props) => {
  const { push } = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userAuditorInfo);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("address", data.address);
    formData.append("id", data.id);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("mobile_number", data.mobile_number);
    dispatch(updateProfileData(formData, push));
  };
  const { register, errors, handleSubmit } = useForm({
    defaultValues: user,
  });

  return (
    <div className="myaccount-edit-form">
      <strong className="form-title">Update Profile</strong>
      <br />
      <br />

      <MuiThemeProvider theme={formLabelsTheme}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          className="account-edit-form"
        >
          <Row>
            <Col md={6}>
              <Form.Group controlId="formBasicFirstName">
                <TextField
                  id="outlined-first_name"
                  required
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(event) => ValidateAlpha(event)}
                  className={!errors.first_name ? classes.root : "w-100"}
                  error={errors.first_name ? true : false}
                  name="first_name"
                  inputRef={register({
                    required: "Please enter first name.",
                    minLength: {
                      value: 3,
                      message:
                        "First name should contain at least 3 characters.",
                    },
                    maxLength: {
                      value: 50,
                      message: "First name should not exceed 50 characters.",
                    },
                  })}
                  helperText={errors.first_name && errors.first_name.message}
                  autoFocus={true}
                />
              </Form.Group>
              <Form.Group controlId="formBasicLastName">
                <TextField
                  id="outlined-last_name"
                  required
                  label="Last Name"
                  variant="outlined"
                  onKeyDown={(event) => ValidateAlpha(event)}
                  fullWidth
                  className={!errors.last_name ? classes.root : "w-100"}
                  error={errors.last_name ? true : false}
                  name="last_name"
                  inputRef={register({
                    required: "Please enter last name.",
                    minLength: {
                      value: 3,
                      message:
                        "Last name should contain at least 3 characters.",
                    },
                    maxLength: {
                      value: 50,
                      message: "last name should not exceed 50 characters.",
                    },
                  })}
                  helperText={errors.last_name && errors.last_name.message}
                />
              </Form.Group>
              <Form.Group controlId="formBasicNumber">
                <TextField
                  id="outlined-number"
                  required
                  label="Number (123456789)"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(event) => checkMobileNumber(event)}
                  className={!errors.mobile_number ? classes.root : "w-100"}
                  error={errors.mobile_number ? true : false}
                  name="mobile_number"
                  inputRef={register({
                    required: "Please enter mobile number.",
                    minLength: {
                      value: 7,
                      message:
                        "Mobile number should contain at least 7 digits.",
                    },
                    maxLength: {
                      value: 15,
                      message: "Mobile number should not exceed 15 digits.",
                    },
                  })}
                  helperText={
                    errors.mobile_number && errors.mobile_number.message
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBasicAddress">
                <TextField
                  id="outlined-address"
                  required
                  label="Address"
                  variant="outlined"
                  fullWidth
                  className={!errors.address ? classes.root : "w-100"}
                  error={errors.address ? true : false}
                  name="address"
                  inputRef={register({
                    required: "Please enter address.",
                    minLength: {
                      value: 10,
                      message: "Address should contain at least 10 characters.",
                    },
                    maxLength: {
                      value: 500,
                      message: "Address should not exceed 500 characters.",
                    },
                    validate: {
                      isSpace: (value) =>
                        checkSpace(value) ||
                        "Remove trailing spaces from address.",
                    },
                  })}
                  helperText={errors.address && errors.address.message}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Control
            type="hidden"
            name="id"
            defaultValue={user._id}
            ref={register({})}
          />
          <Row>
            <Col md={4} sm={12}>
              <SubmitButton title="Update" />
            </Col>
          </Row>
        </Form>
      </MuiThemeProvider>
    </div>
  );
};

export default Index;
