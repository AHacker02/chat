import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../actions/authActions";
import { Field, reduxForm } from "redux-form";
import { ErrorAlert, InputTextField, useStyles } from "../common/components";
import Paper from "@material-ui/core/Paper";
import loader from "../../resources/785.gif";

const Login = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const isLoading = useSelector((state) => state.application.isLoading);

  const onSubmit = (userCreds) => {
    dispatch(signIn(userCreds));
  };

  return (
    <Grid alignItems="center" container justify="center">
      <Paper variant="elevation" className={classes.paper}>
        <Typography align="center" variant="h4">
          Welcome back!
        </Typography>
        <Typography align="center">
          We're so excited to see you again!
        </Typography>
        <ErrorAlert errorMessage={errorMessage} />
        <form onSubmit={props.handleSubmit(onSubmit)} autoComplete="off">
          <Field name="email" label="Email" component={InputTextField} />
          <Field
            name="password"
            label="Password"
            component={InputTextField}
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <img src={loader} alt="loading" style={{ maxWidth: "24px" }} />
            ) : (
              "Login"
            )}
          </Button>
          <Typography align="left">
            Need an account? <Link to="/authorize/signup">Register</Link>
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

const validate = (values) => {
  const errors = {};
  const requiredFields = ["email", "password"];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

export default reduxForm({ form: "login", validate })(Login);
