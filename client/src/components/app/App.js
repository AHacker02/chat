import "./App.css";
import Imessage from "../imessage/imessage";
import { useDispatch, useSelector } from "react-redux";
import history from "../../utils/history";
import { Route, Router, Switch } from "react-router-dom";
import { selectUser } from "../../features/userSlice";
import Login from "../authorize/login/login";
import { useEffect } from "react";
import Register from "../authorize/register/register";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
      history.push("/");
    }
  }, [user]);

  return (
    <Router history={history}>
      <div className="app">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">{user && <Imessage />}</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
