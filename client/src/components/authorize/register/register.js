import React from "react";
import "./register.css";
import { Button, FormControl, FormLabel } from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import FormTextField from "../../common/formtextfield";
import { useDispatch, useSelector } from "react-redux";
import { selectFormError, selectLoading } from "../../../features/appSlice";
import { Link } from "react-router-dom";
import { register } from "../../../features/userSlice";

const fields = [
  { name: "firstname", type: "text" },
  { name: "lastname", type: "text" },
  { name: "email", type: "email" },
  { name: "password", type: "password" },
];
const formName = "register";

const Register = (props) => {
  const formError = useSelector((state) => selectFormError(state, formName));
  const loading = useSelector((state) => selectLoading(state, formName));
  const dispatch = useDispatch();
  const signUp = (userDetails) => {
    dispatch(register(userDetails));
  };

  return (
    <div className="register">
      <div className="register__container">
        <FormControl
          component="form"
          margin="normal"
          className="register__form"
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
        <div className="register__social">
          <small>Or Sign Up Using</small>
          <img
            //onClick={googleSignIn}
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

export default reduxForm({ form: formName })(Register);
