import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { signUp } from "../../actions/authActions";
import { ErrorAlert, InputTextField, useStyles } from "../common/components";
import Paper from "@material-ui/core/Paper";

const SignUp = (props) => {
  const classes = useStyles();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.application.isLoading);
  const onSubmit = (formValues) => {
    dispatch(signUp(formValues));
  };

  return (
    <Grid alignItems="center" container justify="center">
      <Paper variant="elevation" className={classes.paper}>
        <Typography variant="h4" align="center">
          Create an account
        </Typography>
        <ErrorAlert errorMessage={errorMessage} />
        <form onSubmit={props.handleSubmit(onSubmit)} autoComplete="off">
          <Field
            name="firstname"
            component={InputTextField}
            label="First Name"
          />
          <Field name="lastname" component={InputTextField} label="Last Name" />
          <Field name="email" component={InputTextField} label="Email" />
          <Field
            name="password"
            component={InputTextField}
            label="Password"
            type="password"
          />
          <Field
            name="dob"
            component={InputTextField}
            label="Birthday"
            type="date"
            inputProps={{ shrink: true }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <img src={require("../../resources/2.gif")} alt="loading" />
            ) : (
              "Create Account"
            )}
          </Button>
          <Typography align="left">
            <Link to="/authorize/login">Already have an account?</Link>
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

/*const asyncValidate = async (values) => {
  const errors = {};
  try {
    if (values["email"]) {
      await api.get(EMAIL_CHECK, { params: { email: values.email } });
    }
  } catch (e) {
    errors.email = e.message;
  }
  return errors;
};*/
const validate = (values) => {
  const errors = {};
  const requiredFields = ["email", "firstname", "lastname", "password", "dob"];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (values.password && values.password.length < 8) {
      errors.password = "Password needs to be minimum 8 characters";
    }
  });
  return errors;
};

export default reduxForm({
  form: "signUpForm",
  validate,
})(SignUp);
