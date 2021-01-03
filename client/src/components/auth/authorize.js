import React from "react";
import { Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Login from "./login";
import SignUp from "./signup";

const Authorize = ({ match }) => {
  return (
    <Grid item container alignContent="center" xs={10} md={4} justify="center">
      <Route path={`${match.path}/login`} component={Login} />
      <Route path={`${match.path}/signup`} component={SignUp} />
    </Grid>
  );
};

export default Authorize;
