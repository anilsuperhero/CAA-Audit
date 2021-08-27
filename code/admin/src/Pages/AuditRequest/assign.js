import React, { useState, useEffect, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Form, Row, Col } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import SubmitButton from "../../Component/Button";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loadTosterData } from "../../actions/baseActions";
import { assignAuditor } from "../../actions/auditRequestActions";
import { formLabelsTheme } from "../../utils/helpers";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DateRangeIcon from "@material-ui/icons/DateRange";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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

export default function Assign(props) {
  const handleClose = () => {
    props.handleClose();
  };
  const { register, errors, handleSubmit, setValue } = useForm();
  const dispatch = useDispatch();
  const { open, detail, auditorData } = props;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartDate, setShowStartDate] = useState("");
  const [showEndDate, setShowEndDate] = useState("");
  const [item] = useState(detail);
  const [lead, setLead] = useState("");
  const [support, setSupport] = useState("");
  const [peer, setPeer] = useState("");
  const classes = useStyles();
  const handleAuditorSelection = (value, type) => {
    if (type === "lead") {
      setLead(value);
    } else if (type === "support") {
      setSupport(value);
    } else if (type === "peer") {
      setPeer(value);
    }
  };

  useEffect(() => {
    if (detail.is_stage) {
      setStartDate(detail.startDateStage);
      setEndDate(detail.endDateStage);
      setShowStartDate(detail.startDateStage);
      setShowEndDate(detail.endDateStage);
    } else {
      setStartDate(detail.startDate);
      setEndDate(detail.endDate);
      setShowStartDate(detail.startDate);
      setShowEndDate(detail.endDate);
    }
  }, [
    detail.is_stage,
    detail.startDate,
    detail.endDate,
    detail.startDateStage,
    detail.endDateStage,
  ]);

  const getSelectedItem = (type) => {
    if (type === "lead") {
      const item = auditorData.find((opt) => opt._id === detail.lead);
      setLead(detail.lead);
      return item || {};
    } else if (type === "support") {
      const item = auditorData.find((opt) => opt._id === detail.support);
      setSupport(detail.support);
      return item || {};
    } else if (type === "peer") {
      const item = auditorData.find((opt) => opt._id === detail.peer);
      setPeer(detail.peer);
      return item || {};
    }
  };

  const handleClickDate = (date, type) => {
    if (date) {
      if (type === "startDate") {
        setStartDate(date);
        setShowStartDate(date.format("DD-MM-YYYY"));
        setValue("startDate", date.format("DD-MM-YYYY"));
      } else {
        setValue("endDate", date.format("DD-MM-YYYY"));
        setShowEndDate(date.format("DD-MM-YYYY"));
        setEndDate(date);
      }
    } else {
      if (type === "startDate") {
        setStartDate("");
        setShowStartDate("");
        setValue("startDate", null);
      } else {
        setValue("endDate", null);
        setShowEndDate("");
        setEndDate("");
      }
    }
  };
  const renderInputDate = (props) => (
    <TextField
      type="text"
      fullWidth
      onClick={props.onClick}
      value={showStartDate}
      autoFocus={true}
      name="startDate"
      id="outlined-formDate"
      label="Start Date"
      className={!errors.startDate ? classes.root : "w-100"}
      error={errors.startDate ? true : false}
      inputRef={register({
        required: "Please choose start date.",
      })}
      helperText={errors.startDate && errors.startDate.message}
      required
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment>
            {startDate && (
              <IconButton onClick={() => setStartDate("")}>
                <HighlightOffIcon />
              </IconButton>
            )}
            <IconButton onClick={props.onClick}>
              <DateRangeIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
  const renderInputEndDate = (props) => (
    <TextField
      type="text"
      fullWidth
      onClick={props.onClick}
      value={showEndDate}
      name="endDate"
      id="outlined-endDate"
      label="End Date"
      className={!errors.endDate ? classes.root : "w-100"}
      error={errors.endDate ? true : false}
      inputRef={register({
        required: "Please choose start date.",
      })}
      helperText={errors.endDate && errors.endDate.message}
      required
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment>
            {endDate && (
              <IconButton onClick={() => setEndDate("")}>
                <HighlightOffIcon />
              </IconButton>
            )}
            <IconButton onClick={props.onClick}>
              <DateRangeIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  const onSubmit = (data) => {
    var request = {};
    request.startDate = data.startDate;
    request.endDate = data.endDate;
    request.lead = lead;
    request.support = support;
    request.peer = peer;
    request.id = item._id;
    var array = Object.values(request);
    if (item.type === "Certification") {
      if (new Set(array).size !== array.length) {
        dispatch(
          loadTosterData({
            open: true,
            message:
              "Lead Auditor / Support Auditor / Peer Auditor can't be same.",
            severity: "error",
          })
        );
        return false;
      }
    }
    dispatch(assignAuditor(request, handleClose));
  };

  return (
    <Fragment>
      <Dialog open={open} fullWidth={true} maxWidth={"sm"}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Confirm the audit date and assign the auditor(s) for the {item.type}
          &nbsp; ref (quote) #{item.title}
        </DialogTitle>
        <DialogContent dividers>
          <MuiThemeProvider theme={formLabelsTheme}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Row>
                <Col md={12} lg={12}>
                  <Form.Group>
                    <TextField
                      id="outlined-title"
                      label="Requested Audit Date"
                      variant="outlined"
                      value={
                        detail.is_stage
                          ? detail.audit_date_stage
                          : detail.audit_date
                      }
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Form.Group>
                  {detail.audit_date && (
                    <Form.Group>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          autoOk
                          fullWidth
                          clearable={startDate ? true : false}
                          format="DD-MM-YYYY"
                          value={startDate}
                          id="date-picker-inline"
                          disablePast={true}
                          className="w-100"
                          minDate={
                            detail.is_stage
                              ? moment(detail.audit_date_stage, "DD-MM-YYYY")
                              : moment(detail.audit_date, "DD-MM-YYYY")
                          }
                          onChange={(date) =>
                            handleClickDate(date, "startDate")
                          }
                          TextFieldComponent={renderInputDate}
                        />
                      </MuiPickersUtilsProvider>
                    </Form.Group>
                  )}

                  <Form.Group>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        autoOk
                        fullWidth
                        clearable={endDate ? true : false}
                        format="dd-MM-yyyy"
                        id="date-picker-inline"
                        className="w-100"
                        disablePast={true}
                        value={endDate}
                        minDate={
                          detail.is_stage
                            ? moment(detail.audit_date_stage, "DD-MM-YYYY")
                            : moment(detail.audit_date, "DD-MM-YYYY")
                        }
                        onChange={(date) => handleClickDate(date, "endDate")}
                        TextFieldComponent={renderInputEndDate}
                      />
                    </MuiPickersUtilsProvider>
                  </Form.Group>
                  {auditorData.length > 0 && (
                    <Form.Group controlId="formBasicCompany">
                      {detail.lead ? (
                        <Autocomplete
                          id="combo-box-demo"
                          options={auditorData}
                          defaultValue={() => getSelectedItem("lead")}
                          onChange={(event, value) =>
                            value && handleAuditorSelection(value._id, "lead")
                          }
                          getOptionLabel={(option) => option.first_name}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label="Select Lead Auditor"
                              variant="outlined"
                              fullWidth
                              error={errors.lead ? true : false}
                              name="lead"
                              inputRef={register({
                                required: "Please choose any Lead Auditor.",
                              })}
                              helperText={errors.lead && errors.lead.message}
                            />
                          )}
                        />
                      ) : (
                        <Autocomplete
                          id="combo-box-demo"
                          options={auditorData}
                          onChange={(event, value) =>
                            value && handleAuditorSelection(value._id, "lead")
                          }
                          getOptionLabel={(option) => option.first_name}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label="Select Lead Auditor"
                              variant="outlined"
                              fullWidth
                              error={errors.lead ? true : false}
                              name="lead"
                              inputRef={register({
                                required: "Please choose any Lead Auditor.",
                              })}
                              helperText={errors.lead && errors.lead.message}
                            />
                          )}
                        />
                      )}
                    </Form.Group>
                  )}

                  {auditorData.length > 0 && (
                    <Form.Group controlId="formBasicCompany">
                      {detail.support ? (
                        <Autocomplete
                          defaultValue={() => getSelectedItem("support")}
                          id="combo-box-demo"
                          options={auditorData}
                          onChange={(event, value) =>
                            value
                              ? handleAuditorSelection(value._id, "support")
                              : handleAuditorSelection("", "support")
                          }
                          getOptionLabel={(option) => option.first_name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Support Auditor"
                              variant="outlined"
                              fullWidth
                              name="support"
                              inputRef={register()}
                            />
                          )}
                        />
                      ) : (
                        <Autocomplete
                          id="combo-box-demo"
                          options={auditorData}
                          onChange={(event, value) =>
                            value
                              ? handleAuditorSelection(value._id, "support")
                              : handleAuditorSelection("", "support")
                          }
                          getOptionLabel={(option) => option.first_name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Support Auditor"
                              variant="outlined"
                              fullWidth
                              name="support"
                              inputRef={register()}
                            />
                          )}
                        />
                      )}
                    </Form.Group>
                  )}
                  {item.type === "Certification" ? (
                    <Fragment>
                      {auditorData.length > 0 && (
                        <Form.Group controlId="formBasicCompany">
                          {detail.peer ? (
                            <Autocomplete
                              defaultValue={() => getSelectedItem("peer")}
                              id="combo-box-demo"
                              options={auditorData}
                              onChange={(event, value) =>
                                value &&
                                handleAuditorSelection(value._id, "peer")
                              }
                              getOptionLabel={(option) => option.first_name}
                              renderInput={(params) => (
                                <TextField
                                  required
                                  {...params}
                                  label="Select Peer Auditor"
                                  variant="outlined"
                                  fullWidth
                                  error={errors.peer ? true : false}
                                  name="peer"
                                  inputRef={register({
                                    required: "Please choose any Peer Auditor.",
                                  })}
                                  helperText={
                                    errors.peer && errors.peer.message
                                  }
                                />
                              )}
                            />
                          ) : (
                            <Autocomplete
                              id="combo-box-demo"
                              options={auditorData}
                              onChange={(event, value) =>
                                value &&
                                handleAuditorSelection(value._id, "peer")
                              }
                              getOptionLabel={(option) => option.first_name}
                              renderInput={(params) => (
                                <TextField
                                  required
                                  {...params}
                                  label="Select Peer Auditor"
                                  variant="outlined"
                                  fullWidth
                                  error={errors.peer ? true : false}
                                  name="peer"
                                  inputRef={register({
                                    required: "Please choose any Peer Auditor.",
                                  })}
                                  helperText={
                                    errors.peer && errors.peer.message
                                  }
                                />
                              )}
                            />
                          )}
                        </Form.Group>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {auditorData.length > 0 && (
                        <Form.Group controlId="formBasicCompany">
                          {detail.peer ? (
                            <Autocomplete
                              defaultValue={() => getSelectedItem("peer")}
                              id="combo-box-demo"
                              options={auditorData}
                              onChange={(event, value) =>
                                value &&
                                handleAuditorSelection(value._id, "peer")
                              }
                              getOptionLabel={(option) => option.first_name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Peer Auditor"
                                  variant="outlined"
                                  fullWidth
                                  error={errors.peer ? true : false}
                                  name="peer"
                                  helperText={
                                    errors.peer && errors.peer.message
                                  }
                                />
                              )}
                            />
                          ) : (
                            <Autocomplete
                              id="combo-box-demo"
                              options={auditorData}
                              onChange={(event, value) =>
                                value &&
                                handleAuditorSelection(value._id, "peer")
                              }
                              getOptionLabel={(option) => option.first_name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Peer Auditor"
                                  variant="outlined"
                                  fullWidth
                                  error={errors.peer ? true : false}
                                  name="peer"
                                  helperText={
                                    errors.peer && errors.peer.message
                                  }
                                />
                              )}
                            />
                          )}
                        </Form.Group>
                      )}
                    </Fragment>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={3} md={3} xl={3} xxl={3}>
                  <SubmitButton title={"Submit"} />
                </Col>
              </Row>
            </Form>
          </MuiThemeProvider>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
