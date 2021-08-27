import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { formLabelsTheme } from "../../../utils/helpers";
import { Form } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { loadDialogData } from "../../../actions/baseActions";
import { useDispatch, useSelector } from "react-redux";
import Delete from "../../../Component/Delete";
import { submitRequest } from "../../../actions/documentAction";
import moment from "moment";

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

const RequestDialog = (props) => {
  const { open, setOpen, slug } = props;
  const { register, errors, handleSubmit, setValue } = useForm();
  const classes = useStyles();
  const [date, setDate] = useState(moment(new Date()).add(1, "months"));
  const [showDate, setShowDate] = useState(
    moment(new Date()).add(1, "months").format("DD-MM-YYYY")
  );
  const [dialog, setDialog] = useState({});
  const renderInputDate = (props) => (
    <TextField
      type="text"
      fullWidth
      onClick={props.onClick}
      autoFocus={true}
      value={showDate}
      name="auditDate"
      id="outlined-formDate"
      label="Please select your preferred date for the audit to take place"
      className={!errors.auditDate ? classes.root : "w-100"}
      error={errors.auditDate ? true : false}
      inputRef={register({
        required: "Please choose audit date.",
      })}
      helperText={errors.auditDate && errors.auditDate.message}
      required
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment>
            {date && (
              <IconButton onClick={() => setDate("")}>
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
  const handleClickDate = (date) => {
    if (date) {
      setValue("auditDate", date.format("DD-MM-YYYY"));
      setShowDate(date.format("DD-MM-YYYY"));
      setDate(date);
    } else {
      setValue("auditDate", null);
      setShowDate(null);
      setDate(null);
    }
  };
  const dispatch = useDispatch();
  const { dialogOpen, setting } = useSelector((state) => ({
    dialogOpen: state.dialogOpen,
    setting: state.setting,
  }));

  const onSubmit = (data) => {
    data.auditId = slug;
    data.message = setting.submit_request + " " + data.auditDate;
    data.title = data.document_name;
    data.dialogTitle = "Submit the documents and book your audit";
    data.open = true;
    setDialog(data);
    dispatch(loadDialogData(true));
  };

  const handleConformation = () => {
    setOpen(true);
  };

  const handleConformClick = (data) => {
    if (data.action) {
      dispatch(submitRequest(data, handleConformation));
    }
  };

  return (
    <div>
      <Dialog fullWidth={true} open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          {"Submit & Request audit date"}
        </DialogTitle>
        <MuiThemeProvider theme={formLabelsTheme}>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <DialogContent>
              <Form.Group>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    autoOk
                    fullWidth
                    clearable={date ? true : false}
                    format="DD-MM-YYYY"
                    id="date-picker-inline"
                    className="w-100"
                    disablePast={true}
                    value={date}
                    onChange={(date) => handleClickDate(date ? date : "")}
                    TextFieldComponent={renderInputDate}
                  />
                </MuiPickersUtilsProvider>
              </Form.Group>
              <Form.Group controlId="formBasicDescription">
                <TextField
                  id="outlined-description"
                  label="Remarks"
                  variant="outlined"
                  fullWidth
                  className={!errors.description ? classes.root : "w-100"}
                  error={errors.description ? true : false}
                  name="description"
                  multiline
                  rows={6}
                  inputRef={register()}
                  helperText={errors.description && errors.description.message}
                />
              </Form.Group>
            </DialogContent>
            <DialogActions className="d-flex justify-content-start ml-3 mb-3 pt-0">
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
                className="login-btn green-bg"
              >
                Submit
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="contained"
                size="large"
                className="login-btn"
              >
                Cancel
              </Button>
            </DialogActions>
          </Form>
        </MuiThemeProvider>
      </Dialog>
      {dialogOpen && (
        <Delete
          dialog={dialog}
          handleDeleteClick={handleConformClick}
          title={"Submit"}
        />
      )}
    </div>
  );
};

export default RequestDialog;
