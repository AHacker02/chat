import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import theme from "./theme";
import App from "./components/app";
import { loadState } from "./utils/localStorage";
import { saveAuthToken } from "./utils/middleware";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const preloadedState = loadState();
const store = createStore(
  reducers,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk, saveAuthToken))
);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
