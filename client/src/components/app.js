import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import "./app.css";
import Chat from "./chat/chat";
import Authorize from "./auth/authorize";
import { useSelector } from "react-redux";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: { height: "100vh" },
}));

const App = () => {
  const classes = useStyles();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (!auth.isSignedIn) history.push("/authorize/login");
  }, [auth]);

  return (
    <Grid
      container
      alignContent="center"
      justify="center"
      className={classes.container}
    >
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Chat} />
          <Route path="/authorize" component={Authorize} />
        </Switch>
      </Router>
    </Grid>
  );
};

export default App;
