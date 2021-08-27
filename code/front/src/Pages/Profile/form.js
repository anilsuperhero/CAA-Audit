import { makeStyles, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { updateProfileData } from "../../actions/userActions";
import SubmitButton from "../../Component/Button";
import { MuiThemeProvider } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import config from "../../config";

import {
  ValidateAlpha,
  formLabelsTheme,
  checkNumber,
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

  const user = useSelector((state) => state.userInfo);
  const [state, setState] = useState("SA");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("abn_number", data.abn_number);
    formData.append("address", data.address);
    formData.append("id", data.id);
    formData.append("address_line", data.address_line);
    formData.append("city", data.city);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("mobile_number", data.mobile_number);
    formData.append("landline_number", data.landline_number);
    formData.append("postcode", data.postcode);
    dispatch(updateProfileData(formData, push));
  };
  const { register, errors, handleSubmit } = useForm({
    defaultValues: user,
  });

  const handleSChange = (event) => {
    setState(event.target.value);
  };

  useEffect(() => {
    setState(user.state);
  }, [user]);

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
                  label="Mobile Number"
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
              <Form.Group controlId="formLandlineNumber">
                <TextField
                  id="outlined-number"
                  label="Landline number"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(event) => checkMobileNumber(event)}
                  className={!errors.landline_number ? classes.root : "w-100"}
                  error={errors.landline_number ? true : false}
                  name="landline_number"
                  inputRef={register({
                    minLength: {
                      value: 7,
                      message:
                        "Landline number should contain at least 7 digits.",
                    },
                    maxLength: {
                      value: 15,
                      message: "Landline number should not exceed 15 digits.",
                    },
                  })}
                  helperText={
                    errors.landline_number && errors.landline_number.message
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBasicABNNumber">
                <TextField
                  required
                  id="outlined-abn_number"
                  label="ABN Number"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(event) => checkNumber(event)}
                  className={!errors.abn_number ? classes.root : "w-100"}
                  error={errors.abn_number ? true : false}
                  InputProps={{
                    readOnly: true,
                  }}
                  name="abn_number"
                  inputRef={register({
                    required: "Please enter ABN Number.",
                    minLength: {
                      value: 11,
                      message: "ABN number should contain at least 11 digits.",
                    },
                    maxLength: {
                      value: 11,
                      message: "ABN number should not exceed 11 digits.",
                    },
                  })}
                  helperText={errors.abn_number && errors.abn_number.message}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBasicAddress">
                <TextField
                  id="outlined-address"
                  required
                  label="Address Line 1"
                  variant="outlined"
                  fullWidth
                  className={!errors.address ? classes.root : "w-100"}
                  error={errors.address ? true : false}
                  name="address"
                  inputRef={register({
                    required: "Please enter address.",
                    minLength: {
                      value: 5,
                      message: "Address should contain at least 5 characters.",
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
              <Form.Group controlId="formBasicAddressLine">
                <TextField
                  id="outlined-addressLine"
                  label="Address Line 2"
                  variant="outlined"
                  fullWidth
                  className={!errors.address_line ? classes.root : "w-100"}
                  error={errors.address_line ? true : false}
                  name="address_line"
                  inputRef={register({
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
                  helperText={
                    errors.address_line && errors.address_line.message
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBasicCity">
                <TextField
                  id="outlined-city"
                  required
                  label="City"
                  onKeyDown={(event) => ValidateAlpha(event)}
                  variant="outlined"
                  fullWidth
                  className={!errors.city ? classes.root : "w-100"}
                  error={errors.city ? true : false}
                  name="city"
                  inputRef={register({
                    required: "Please enter city.",
                    minLength: {
                      value: 5,
                      message: "City should contain at least 5 characters.",
                    },
                    maxLength: {
                      value: 10,
                      message: "city should not exceed 10 characters.",
                    },
                  })}
                  helperText={errors.city && errors.city.message}
                />
              </Form.Group>
              <Form.Group controlId="formBasicState">
                <FormControl variant="outlined" className="w-100">
                  <InputLabel id="demo-simple-select-outlined-label" required>
                    State
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="Age"
                    className="w-100"
                    value={state}
                    onChange={handleSChange}
                  >
                    {config.STATE.map((item, key) => (
                      <MenuItem value={item.id} key={key}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Form.Group>
              <Form.Group controlId="formBasicPostcode">
                <TextField
                  id="outlined-postcode"
                  required
                  label="Postal code"
                  variant="outlined"
                  fullWidth
                  onKeyDown={(event) => checkNumber(event)}
                  className={!errors.postcode ? classes.root : "w-100"}
                  error={errors.postcode ? true : false}
                  name="postcode"
                  inputRef={register({
                    required: "Please enter Postal code.",
                    minLength: {
                      value: 4,
                      message: "Postal code should contain at least 4 digits.",
                    },
                    maxLength: {
                      value: 4,
                      message: "Postal code should not exceed 4 digits.",
                    },
                  })}
                  helperText={errors.postcode && errors.postcode.message}
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
