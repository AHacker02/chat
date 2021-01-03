import { makeStyles, TextField } from "@material-ui/core";
import React from "react";
import { Alert } from "@material-ui/lab";

//Common Style sto be used across
export const useStyles = makeStyles((theme) => ({
  paper: { backgroundColor: "#120F13", padding: "15px" },
  input: { background: "#3C393F" },
}));

//Custom Text field matching app theme and error message
export const InputTextField = ({
  input,
  label,
  meta,
  type = null,
  inputProps = null,
}) => {
  const classes = useStyles();
  if (meta.touched && meta.error) {
    return (
      <TextField
        error
        id={input.name}
        {...input}
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        type={type}
        label={label}
        InputLabelProps={inputProps}
        helperText={meta.error}
        InputProps={{ className: classes.input }}
      />
    );
  }
  return (
    <TextField
      id={input.name}
      {...input}
      variant="outlined"
      fullWidth
      size="small"
      margin="normal"
      type={type}
      label={label}
      InputLabelProps={inputProps}
      InputProps={{ className: classes.input }}
    />
  );
};

//Error
export const ErrorAlert = ({ errorMessage }) => {
  if (errorMessage) {
    return (
      <Alert severity="error" variant="outlined">
        {errorMessage}
      </Alert>
    );
  }
  return null;
};
