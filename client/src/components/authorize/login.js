import "./authorize.css";
import { Field, reduxForm } from "redux-form";
import React from "react";
import { Button, FormControl, FormLabel } from "@material-ui/core";
import { auth, provider } from "../../utils/firebase";
import FormTextField from "../common/formtextfield";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import { Link } from "react-router-dom";
import {
  selectFormError,
  selectLoading,
  setFormError,
} from "../../features/appSlice";

const fields = [
  { name: "email", type: "email" },
  { name: "password", type: "password" },
];

const formName = "login";

const Login = (props) => {
  //#region Variable setup
  const dispatch = useDispatch();
  const formError = useSelector((state) => selectFormError(state, formName));
  const loading = useSelector((state) => selectLoading(state, formName));
  //#endregion

  //Sign In using google account
  const googleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((user) => {
        signIn({ email: user.user.email, password: user.user.uid });
      })
      .catch((error) =>
        dispatch(setFormError({ name: formName, error: error.message }))
      );
  };

  const signIn = (userCred) => {
    dispatch(login(userCred));
  };

  return (
    <div className="authorize">
      <div className="authorize__container">
        <div className="authorize__logo">
          <img src="https://i.redd.it/jdto14wkj9f51.png" alt="" />
          <h1>iMessage</h1>
        </div>
        <FormControl
          component="form"
          margin="normal"
          className="authorize__form"
          onSubmit={props.handleSubmit(signIn)}
        >
          {formError ? (
            <FormLabel error filled>
              {formError}
            </FormLabel>
          ) : null}
          {fields.map((field) => (
            <Field
              key={field.name}
              name={field.name}
              type={field.type}
              component={FormTextField}
            />
          ))}
          <Button disabled={loading} type="submit">
            Sign In
          </Button>
        </FormControl>
        <div className="authorize__social">
          <small>Or Sign In Using</small>
          <img
            onClick={googleSignIn}
            src="https://img-authors.flaticon.com/google.jpg"
            alt=""
          />
        </div>
        <p>
          Don't have an account?{" "}
          <Link to="/register">
            <strong>Sign Up</strong>
          </Link>
        </p>
      </div>
    </div>
  );
};

const validate = (values) => {
  const errors = {};
  fields.forEach((field) => {
    if (!values[field.name]) {
      errors[field.name] = `${
        field.name.charAt(0).toLocaleUpperCase() + field.name.slice(1)
      } cannot be empty`;
    }
  });
  return errors;
};

export default reduxForm({ form: formName, validate })(Login);
