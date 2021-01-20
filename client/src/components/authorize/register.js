import React from "react";
import "./authorize.css";
import { Button, FormControl, FormLabel } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import FormTextField from "../common/formtextfield";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFormError,
  selectLoading,
  setFormError,
} from "../../features/appSlice";
import { Link } from "react-router-dom";
import { register } from "../../features/userSlice";
import { auth, provider } from "../../utils/firebase";
import api from "../../utils/api";
import { EMAIL_CHECK } from "../../utils/endpoints";

const fields = [
  { name: "firstname", type: "text" },
  { name: "lastname", type: "text" },
  { name: "email", type: "email" },
  { name: "password", type: "password" },
];
const formName = "register";

const Register = (props) => {
  //#region Variable setup
  const formError = useSelector((state) => selectFormError(state, formName));
  const loading = useSelector((state) => selectLoading(state, formName));
  const dispatch = useDispatch();
  //#endregion

  // Register using user details from Google account
  const googleSignUp = () => {
    auth
      .signInWithPopup(provider)
      .then(({ user }) => {
        signUp({
          firstName: user.displayName.substr(0, user.displayName.indexOf(" ")),
          lastName: user.displayName.substr(user.displayName.indexOf(" ") + 1),
          email: user.email,
          password: user.uid,
          fromGoogle: true,
        });
      })
      .catch((error) =>
        dispatch(setFormError({ name: formName, error: error.message }))
      );
  };

  const signUp = (userDetails) => {
    dispatch(register(userDetails));
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
          onSubmit={props.handleSubmit(signUp)}
        >
          {formError ? (
            <FormLabel error filled>
              {formError}
            </FormLabel>
          ) : null}
          {fields.map((field) => (
            <Field
              name={field.name}
              type={field.type}
              component={FormTextField}
            />
          ))}
          <Button disabled={loading} type="submit">
            Create Account
          </Button>
        </FormControl>
        <div className="authorize__social">
          <small>Or Sign Up Using</small>
          <img
            onClick={googleSignUp}
            src="https://img-authors.flaticon.com/google.jpg"
            alt=""
          />
        </div>
        <p>
          Already have an account?{" "}
          <Link to="/login">
            <strong>Login</strong>
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
    if (
      field.name === "password" &&
      values[field.name] &&
      values[field.name].length < 8
    ) {
      errors[field.name] = "Password needs to be minimum 8 characters";
    }
  });
  return errors;
};

// Check if email already in use
const asyncValidate = (value) => {
  return api
    .get(EMAIL_CHECK, { params: { email: value["email"] } })
    .then((res) => {
      if (res?.data.message.includes("Email already in use")) {
        throw { email: res.data.message };
      }
    });
};

export default reduxForm({
  form: formName,
  validate,
  asyncValidate,
  asyncBlurFields: ["email"],
})(Register);
