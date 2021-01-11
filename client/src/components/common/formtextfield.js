import React from "react";
import { TextField } from "@material-ui/core";

const FormTextField = ({ input, meta, type }) => {
  const error = meta.touched && meta.error;
  return (
    <TextField
      error={error}
      label={input.name.charAt(0).toLocaleUpperCase() + input.name.slice(1)}
      type={type}
      margin="normal"
      helperText={error ? meta.error : null}
      {...input}
    />
  );
};

export default FormTextField;
